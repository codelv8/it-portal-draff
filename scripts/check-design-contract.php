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
    if (($config['mascot']['styleIndex'] ?? null) !== null
        || ($config['mascot']['animation'] ?? null) !== null
        || ($config['mascot']['style'] ?? null) !== null) {
        $fail('Mascot remains disabled with null style, animation and styleIndex.');
    }
    if ($config['mode'] === 'light' && $config['cornerRadius'] === 32) {
        $pass('Visual direction still explicitly specifies Light + 32px.');
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
    $expectedPages = $contract['htmlPages'] ?? [];
    $actualPages = array_map('basename', glob($root . '/*.html') ?: []);
    // One-file preview is a generated review artifact, not a page to maintain separately.
    $actualPages = array_values(array_diff($actualPages, ['it-portal-aurora-standalone.html']));
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
        $key = $page === 'index.html' ? 'dashboard' : basename($page, '.html');
        if (!preg_match('/<body\s+data-page="' . preg_quote($key, '/') . '"\s*>/i', $html)) {
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
        if ($page !== 'login.html' && !str_contains($app, $page)) {
            $fail("Unregistered page: {$page} is missing from shared app routes.");
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