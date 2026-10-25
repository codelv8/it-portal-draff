<?php
/**
 * Dependency-free design regression guard for the approved IT Portal prototype.
 * Run: php scripts/check-design-contract.php
 * This checks structural invariants; it is NOT a substitute for visual/UX testing.
 */
declare(strict_types=1);

$root = dirname(__DIR__);
$errors = [];
$pass = static function (string $message): void {
    echo "[PASS] {$message}\n";
};
$fail = static function (string $message) use (&$errors): void {
    $errors[] = $message;
    fwrite(STDERR, "[FAIL] {$message}\n");
};
$read = static function (string $path) use ($root, $fail): ?string {
    $full = $root . '/' . $path;
    if (!is_file($full)) {
        $fail("Missing required file: {$path}");
        return null;
    }
    $content = file_get_contents($full);
    if ($content === false) {
        $fail("Cannot read: {$path}");
        return null;
    }
    return $content;
};
$parseJson = static function (string $file) use ($read, $fail): ?array {
    $text = $read($file);
    if ($text === null) {
        return null;
    }
    try {
        $data = json_decode($text, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $exception) {
        $fail("Invalid JSON: {$file}: {$exception->getMessage()}");
        return null;
    }
    if (!is_array($data)) {
        $fail("Expected JSON object: {$file}");
        return null;
    }
    return $data;
};

$config = $parseJson('design-config.json');
$contract = $parseJson('design-contract.json');
$css = $read('assets/css/styles.css');
$app = $read('assets/js/app.js');
$read('assets/js/mock-data.js');
foreach (['DESIGN.md', 'AGENTS.md', 'docs/COMPONENTS.md', 'docs/PAGE-MAP.md', 'docs/UI-REVIEW.md'] as $doc) {
    $read($doc);
}

if ($config && $contract) {
    foreach ($contract['locked'] ?? [] as $key => $expected) {
        $actual = $key === 'mascotEnabled'
            ? ($config['mascot']['enabled'] ?? null)
            : ($config[$key] ?? null);
        if ($actual !== $expected) {
            $fail("Visual identity mismatch: {$key} expected " . json_encode($expected) . ', actual ' . json_encode($actual));
        }
    }
    if (($config['mascot']['enabled'] ?? false) !== true
        || ($config['mascot']['styleIndex'] ?? null) !== null
        || ($config['mascot']['style'] ?? null) !== 'chibi-anime-it'
        || ($config['mascot']['animation'] ?? null) !== null
        || ($config['mascot']['reactions'] ?? []) !== ($contract['mascotReactions'] ?? [])
        || ($config['mascot']['variants'] ?? []) !== array_keys($contract['mascotVariants'] ?? [])) {
        $fail('Approved mascot requires the consistent chibi-anime-it identity, static artwork and registered reactions.');
    }
    $reactions = $contract['mascotReactions'] ?? [];
    if (count($reactions) !== 10 || count(array_unique($reactions)) !== 10) {
        $fail('Exactly ten distinct mascot reactions must be registered.');
    }
    $variants = $contract['mascotVariants'] ?? [];
    if (array_keys($variants) !== ['full', 'half-body']) {
        $fail('Mascot variants must include full and half-body.');
    }
    foreach ($variants as $variant => $variantConfig) {
      foreach ($reactions as $reaction) {
        $asset = $root . '/assets/images/mascot/' . ($variantConfig['directory'] ?? '') . $reaction . '.png';
        $image = is_file($asset) ? @getimagesize($asset) : false;
        if ($image === false || $image[2] !== IMAGETYPE_PNG) {
            $fail('Missing or invalid mascot PNG: ' . $variant . '/' . $reaction);
        } elseif (ord((string) file_get_contents($asset, false, null, 25, 1)) !== 6) {
            $fail('Mascot PNG must retain RGBA transparency: ' . $variant . '/' . $reaction);
        } elseif (($variantConfig['square'] ?? false) && $image[0] !== $image[1]) {
            $fail('Compact mascot PNG must have a square canvas: ' . $reaction);
        }
      }
    }
    if (($config['mode'] ?? null) === 'dark'
        && ($config['cornerRadius'] ?? null) === 32
        && ($contract['supportedModes'] ?? []) === ['dark', 'light']) {
        $pass('Approved default Dark + optional Light, shared 32px radius.');
    } else {
        $fail('Mode contract requires Dark default with Light option and 32px radius.');
    }
}

if ($css !== null && $contract) {
    // A later :root declaration legitimately overrides earlier variables; compare effective values.
    preg_match_all('/:root\s*\{([^}]*)\}/s', $css, $rootBlocks);
    $vars = [];
    foreach ($rootBlocks[1] as $block) {
        preg_match_all('/(--[a-z][a-z0-9-]*)\s*:\s*([^;]+)(?:;|$)/i', $block, $declarations, PREG_SET_ORDER);
        foreach ($declarations as $declaration) {
            $vars[$declaration[1]] = trim($declaration[2]);
        }
    }
    $compact = static fn(string $value): string => strtolower(preg_replace('/\s+/', '', $value) ?? $value);
    foreach ($contract['cssVariables'] ?? [] as $name => $expected) {
        if (!array_key_exists($name, $vars)) {
            $fail("Missing CSS theme variable: {$name}");
        } elseif ($compact($vars[$name]) !== $compact((string) $expected)) {
            $fail("CSS theme drift: {$name} expected '{$expected}', got '{$vars[$name]}'");
        }
    }
    // Verify dark-mode values in the explicit shared selector; don't allow a palette name
    // in docs alone to satisfy the contract.
    foreach ($contract['themeVariants'] ?? [] as $mode => $variant) {
        $selector = (string) ($variant['selector'] ?? '');
        $found = $selector !== '' && preg_match('/' . preg_quote($selector, '/') . '\s*\{([^}]*)\}/s', $css, $block);
        if (!$found) {
            $fail("Missing {$mode} theme selector: {$selector}");
            continue;
        }
        preg_match_all('/(--[a-z][a-z0-9-]*)\s*:\s*([^;]+)(?:;|$)/i', $block[1], $darkDeclarations, PREG_SET_ORDER);
        $themeVars = [];
        foreach ($darkDeclarations as $declaration) {
            $themeVars[$declaration[1]] = trim($declaration[2]);
        }
        foreach ($variant['cssVariables'] ?? [] as $key => $expected) {
            if (!isset($themeVars[$key])) {
                $fail("{$mode} theme variable missing: {$key}");
            } elseif ($compact($themeVars[$key]) !== $compact((string) $expected)) {
                $fail("{$mode} theme drift: {$key}");
            }
        }
    }
    foreach ($contract['requiredCssPatterns'] ?? [] as $pattern) {
        if (!str_contains($css, (string) $pattern)) {
            $fail("Missing approved UI component or behavior: {$pattern}");
        }
    }
    if (preg_match('/@import\s+[^;]+;/i', $css)) {
        $fail('The shared CSS must not import another stylesheet/theme.');
    }
    if (preg_match('/font-family\s*:\s*(?!var\(--font\))[^;}]*\b(?:Inter|Roboto|Poppins)\b/i', $css)) {
        $fail('Unapproved competing primary font family in CSS.');
    }
    $pass('Canonical CSS token values and core primitives checked.');
}

if ($contract && $app !== null) {
    foreach (['THEME_STORAGE', 'it-portal-theme-v1', 'data-theme-choice', 'toggle-theme', 'themeButton()', 'document.documentElement.dataset.theme'] as $marker) {
        if (!str_contains($app, $marker)) {
            $fail("Missing theme behavior in shared app: {$marker}");
        }
    }
    $expectedPages = $contract['htmlPages'] ?? [];
    $actualPages = array_map('basename', glob($root . '/*.html') ?: []);
    foreach (glob($root . '/admin/*.html') ?: [] as $adminPage) {
        $actualPages[] = 'admin/' . basename($adminPage);
    }
    // One-file preview is a generated review artifact, not a page to maintain separately.
    $actualPages = array_values(array_diff($actualPages, ['it-portal-aurora-standalone.html']));
    $actualPages = array_values(array_diff($actualPages, array_keys($contract['compatibilityRedirects'] ?? [])));
    sort($expectedPages);
    sort($actualPages);
    if ($expectedPages !== $actualPages) {
        $fail('HTML page inventory mismatch. Update docs/PAGE-MAP.md and design-contract.json with approved route additions.');
    }
    foreach ($expectedPages as $page) {
        $html = $read($page);
        if ($html === null) {
            continue;
        }
        $entry = $contract['entrypoints'][$page] ?? [];
        $key = $entry['page'] ?? '';
        $area = $entry['area'] ?? '';
        if (!preg_match('/<body\s+data-area="' . preg_quote($area, '/') . '"\s+data-page="' . preg_quote($key, '/') . '"\s*>/i', $html)) {
            $fail("Invalid shared app entrypoint data-page in {$page}");
        }
        foreach (['assets/css/styles.css', 'assets/js/mock-data.js', 'assets/js/app.js'] as $asset) {
            if (!str_contains($html, $asset)) {
                $fail("Missing shared asset {$asset} in {$page}");
            }
        }
        if (preg_match('/<style\b|style\s*=|<(?:script|link)\b[^>]*(?:https?:\/\/|\/\/)/i', $html)) {
            $fail("Page-level styling or external UI dependency found in {$page}; use shared assets.");
        }
        if ($area === 'public') {
            foreach (['assets/js/public-data.js', 'assets/js/public.js'] as $publicAsset) {
                if (!str_contains($html, $publicAsset)) {
                    $fail("Missing public renderer asset: {$publicAsset} in {$page}");
                }
            }
        }
        if ($area === 'admin' && $key !== 'login' && !str_contains($app, basename($page))) {
            $fail("Unregistered page: {$page} is missing from shared app routes.");
        }
        preg_match_all('/(?:src|href)="([^"#?]+)"/', $html, $assetRefs);
        foreach ($assetRefs[1] as $ref) {
            if (!preg_match('~^(?:https?:|mailto:)~', $ref) && !is_file(dirname($root . '/' . $page) . '/' . $ref)) {
                $fail("Broken local entrypoint reference: {$page} -> {$ref}");
            }
        }
    }
    foreach ($contract['compatibilityRedirects'] ?? [] as $legacy => $target) {
        $html = $read($legacy);
        if ($html === null || !str_contains($html, 'data-redirect="' . $target . '"') || !str_contains($html, 'assets/js/redirect.js') || !is_file($root . '/' . $target)) {
            $fail("Invalid compatibility redirect: {$legacy}");
        }
    }
    $pass('All approved HTML screens reuse CSS and shared JS assets.');
}

foreach (glob($root . '/assets/css/*.css') ?: [] as $cssFile) {
    if (basename($cssFile) !== 'styles.css') {
        $fail('New CSS file ' . basename($cssFile) . ' requires design-system review; extend shared styles or update guardrail.');
    }
}
foreach (['woff', 'woff2', 'ttf', 'otf'] as $extension) {
    foreach (glob($root . '/assets/fonts/*.' . $extension) ?: [] as $fontFile) {
        $fail('Do not include font binaries in checked-in theme: ' . basename($fontFile));
    }
}

if (count($errors) > 0) {
    fwrite(STDERR, "\nUI DESIGN CONTRACT FAILED: " . count($errors) . " issue(s).\n");
    exit(1);
}
echo "\nUI DESIGN CONTRACT PASSED (structural only; visual screenshots still required).\n";
exit(0);
