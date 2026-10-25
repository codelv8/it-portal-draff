# IT Portal Design System — Aurora Coral Light + Dark Glass

> **Status: ACCEPTED UI BASELINE · v3.1 · 2026-10-25**
> Scope: every existing and future page, module, partial, dialog, and component in `codelv8-org/it-portal`.
>
> **Rule:** When the mock UI and this document disagree, do not improvise. Treat `design-config.json` as the user's locked visual direction and the running baseline in `assets/css/styles.css` + existing HTML/JS as the reference implementation. Open a design-change proposal before modifying visual identity.

## 1. Product and visual intent

Hospital IT work-management portal for **IT Staff** and **IT Lead**, optionally Executive Viewer later. It connects daily tasks, team workload, projects, roadmap, KPI, evidence, governance and reports.

**Design identity:** calm professional **Aurora Gradient** in **Light + Dark**, with **coral** as the action accent, translucent **glass** surfaces, **32px panel radius**, Thai-first **LINE Seed Sans TH**, and **approved static chibi IT mascot illustrations**. **Dark is the new default** as explicitly approved on 2026-10-25. This remains Aurora Glass, **not** the retired neon/HUD design.

Visual trade-off accepted: Light keeps the original airy look; Dark reduces glare, but extra translucent layers can compromise readability. Therefore keep content legible in **both** modes, using stronger foreground / surface values on tables, forms and dense screens. Clarity and safe operation outrank decorative blur.

## 2. Locked visual contract

**Machine-readable owner:** `design-config.json` (user intent) + `design-contract.json` (automated regression assertions). **Rendered CSS owner:** `assets/css/styles.css` (existing `:root`). Do not invent a second theme or copy the tokens into page-level CSS.

| Attribute | Accepted value | Implementation |
| --- | --- | --- |
| Visual direction | Aurora Gradient reference | soft large-scale coral/peach/lavender/mint ambient radial gradients |
| Layout | Portal | persistent sidebar, topbar, main workspace, mobile drawer |
| Surface | Glass | warm frosted white (Light), translucent charcoal-plum (Dark), subtle stroke, blur and soft shadow |
| Palette | Coral | coral for selected/action states; semantic colors for status only |
| Mode | **Dark (default) + Light (user choice)** | root `data-theme`; localStorage key `it-portal-theme-v1`; no separate product/HUD styling |
| Main panel radius | **32px** | `--radius`, `.glass` panels, dialog |
| Inner/card radius | **19px** | `--radius-small`, small surfaces; buttons ~15px, input ~15px |
| Font | **LINE Seed Sans TH** | fallback: Noto Sans Thai / Tahoma / system-ui |
| Mascot | **Enabled — ADR-0003** | ten consistent static chibi/anime IT-worker reactions in full and half-body variants; decorative, contextual and never a substitute for status text |
| Technology | HTML + CSS + Vanilla JS; later Native PHP | do not introduce Tailwind, Bootstrap, React or a new UI library without approval |

**Canonical Light token layer** in `assets/css/styles.css` (`:root`), preserved for backward compatibility:

```css
:root {
  --bg: #fbf8f8;
  --ink: #332d38;
  --ink-soft: #5d5664;
  --muted: #756776; /* effective last declaration (readability refinement) */
  --coral: #f46f75;
  --coral-dark: #d54e5c;
  --coral-soft: #fff1ee;
  --peach: #ffd9bd;
  --lavender: #eee0ff;
  --mint: #d9f6e9;
  --surface: rgba(255, 255, 255, .76);
  --surface-strong: rgba(255, 255, 255, .92);
  --surface-muted: rgba(255, 255, 255, .52);
  --radius: 32px;
  --radius-small: 19px;
  --font: 'LINE Seed Sans TH', 'Noto Sans Thai', 'Tahoma', system-ui, sans-serif;
}
```

The shared Dark layer is defined in `html:not([data-theme="light"])`; it provides intentionally contrast-adjusted Coral, ink and glass tokens. Other prototype colors are transitional implementation values, **not** permission to introduce new palettes. Prefer the above custom properties and existing component variants in new code. Do not use rainbow gradients, neon outlines, dark glass, glowing HUD borders or arbitrary purple/blue buttons as a new visual identity.

### Typography and spacing

- Thai-first interface. Headline 25–34px; section headings ~16px; body ~12–14px; compact metadata 10–12px only when accessible. Do not reproduce tiny label sizes for essential data.
- Prefer weight 400 / 700 / 800 with clear hierarchy. Preserve Thai tone marks and line heights >= 1.4 for body.
- Spacing rhythm: 8 / 16 / 24 / 32px; page/workspace padding is responsive; main glass cards use 24px padding on desktop, 18px on narrow screens.
- Decorative gradients live on the **page background** and occasional hero areas; cards remain mostly neutral to keep record tables readable.
- Font binaries are **not committed**. Review official LINE Seed license before local installation or asset procurement. Never substitute a public CDN font without explicit approval.

## 3. Layout and responsive rules

The shared App Shell must remain visually consistent:

```text
.app-shell
  .sidebar                     persistent navigation at desktop
  .workspace
    .topbar                     breadcrumbs, search, notifications, role preview
    main#page-content           demo banner, page heading, page sections
    .footer
```

- Desktop: sidebar ~246px, workspace fills remaining width, max shell width 1920px.
- <= 1200px: compress grids; keep data cards legible.
- <= 900px: sidebar is a dismissible drawer, with backdrop and a real menu button.
- <= 650px: columns stack, record tables use responsive record cards, dialogs fit viewport; avoid horizontal page scrolling (Gantt/Kanban may scroll inside their own containers).
- Preserve `@media(prefers-reduced-motion:reduce)` and `@media print`.

## 4. Component reuse — do not reinvent

Reuse existing classes. See [`docs/COMPONENTS.md`](docs/COMPONENTS.md) for implementation and examples.

| Need | Existing reusable contract |
| --- | --- |
| Frosted panel (both modes) | `.glass.card` |
| Secondary inset surface | `.surface` |
| Primary action | `.btn.btn-primary` |
| Secondary action | `.btn.btn-outline`, `.btn.btn-ghost`, `.btn.btn-soft` |
| State/priority indicator | `.badge` + existing semantic variants |
| Inputs / select / text areas | `.field` + `.input`, `.select`, `.textarea` |
| Page heading | `.page-heading`, `.page-title`, `.page-subtitle` |
| Filter row | `.filters`, `.pill-tabs`, `.tab` |
| Table | `.table-wrap`, `.task-table` |
| Kanban | `.kanban-board`, `.kanban-col`, `.kanban-card` |
| Roadmap | `.gantt`, `.gantt-row`, `.gantt-bar` |
| Dialog | `.modal-backdrop`, `.modal`, `.modal-head`, `.modal-actions` |
| Feedback | `.toast-holder`, `.toast`, `.empty-state` |
| Icons | existing inline SVG renderer `icon(name)` in `assets/js/app.js` |

**Do not duplicate the Sidebar/Topbar or write a new card/button system per module.** Current pages use a thin HTML entrypoint and shared `assets/js/app.js` renderer; PHP should later extract equivalent shared partials without restyling them.

## 5. Interaction and data semantics

- Primary action appears once per workflow and is clearly labeled. State changes provide immediate feedback, validation and accessible focus.
- Tasks: status = `Not Started`, `In Progress`, `At Risk`, `Blocked`, `Completed`, `On Hold`; priority = `P0` Critical, `P1` High, `P2` Medium, `P3` Low. Color **never** replaces the text label.
- Separate **Task Status** from editable **Progress %**. Do not infer project completion, policy compliance, KPI achievement or actual performance from visual progress bars alone.
- KPI: show `Target`, `Actual`, period, formula, baseline/source and evidence approval state independently. In Prototype mode all values must be visibly identified as **mock**.
- Accessibility minimum: keyboard-only navigation, visible focus outline, explicit form labels, proper dialog focus, color contrast (target WCAG 2.2 AA), errors with readable copy, no essential hover-only disclosure.
- Avoid personal health data in demo; mock accounts are not real users and demo login is not authentication. In production enforce authentication/authorization on the server.

## 6. How an AI Agent adds a new page or component

1. Read `AGENTS.md`, this file, `design-config.json`, `docs/COMPONENTS.md`, `docs/PAGE-MAP.md` and `docs/UI-REVIEW.md`.
2. Open `admin/index.html` and the nearest existing workspace screen; inspect the **actual** `.glass`/`.btn`/`.badge` styles and patterns before writing any markup.
3. Choose a related approved screen (task details, project detail, reporting, etc.). Reuse its shell, spacing, typography, filters, states and empty/loading/error behaviors.
4. Use the current design tokens and components, not standalone style attributes or a new framework. If a genuinely new pattern is necessary, extend the shared implementation and update `docs/COMPONENTS.md`.
5. For a new page: add a thin HTML entrypoint with `<body data-area="admin" data-page="new-page">`, existing CSS + shared scripts; register route + heading + navigation + render handler inside `assets/js/app.js`. Update `docs/PAGE-MAP.md`.
6. Test at 390px, 900px, 1440px and 1728px; compare against existing Dashboard, My Work and Team Board baseline. Check keyboard navigation and real screen states.
7. Run `php scripts/check-design-contract.php`. Fill out `.github/PULL_REQUEST_TEMPLATE.md` with comparison images for desktop/mobile and explain any intentional deviation.
8. Do not claim design QA passed if screenshots/browser tests were not actually run. Explicitly report missing verification.

## 7. Change control and precedence

Visual identity changes (primary palette, modes, font, 32px radius, mascot, sidebar pattern, component library) require **explicit product-owner approval** and a new ADR; dual-mode approval is captured in `docs/decisions/ADR-0002-aurora-dark-mode.md`. Keep `design-config.json`, `design-contract.json`, `DESIGN.md`, CSS and screenshots in sync within the same PR.

**Order of authority:** explicit new user direction > `design-config.json` (locked visual identity) > `DESIGN.md` and `design-contract.json` > existing baseline UI CSS/HTML > module-local styling suggestions. When a genuine conflict remains, stop and report it instead of silently creating a parallel theme.

**Approval scope:** accepted appearance only. This acceptance does **not** establish production security, accessibility compliance, or factual KPI/CTAM+ certification.


## 8. Approved Theme v2 — Light + Dark (2026-10-25)

- **Dark is the default** for a new browser. Users can switch using the **sun/moon button** in the shared Topbar or Login; Settings → Theme mode provides a Light/Dark segmented choice. Selection survives page navigation via `localStorage['it-portal-theme-v1']` and is **not** erased by Reset Mock Data.
- The document root uses `data-theme="light"` for Light and `data-theme="dark"` for Dark. Until the JavaScript initializes, **no attribute intentionally resolves to Dark** via `html:not([data-theme="light"])` to avoid a white flash on initial load.
- **Never duplicate CSS or create a separate `*-dark.html`.** Keep both modes in `assets/css/styles.css`; shared components, semantic badge labels and states must be identical. New components require **Light and Dark** styles and focus/hover/disabled/empty/error coverage.
- The original theme-only decision did not approve mascots. ADR-0003 separately records the subsequent explicit approval for ten static chibi IT-worker reactions on public and admin pages.

### v2 Dark tokens (authoritative)

| CSS token | Dark | Purpose |
| --- | --- | --- |
| `--bg` | `#15131f` | base canvas |
| `--ink` | `#f7edf5` | main text |
| `--ink-soft` | `#dfd2df` | secondary text |
| `--muted` | `#c6b7c5` | metadata/labels |
| `--coral` | `#ffa0a6` | light Coral detail |
| `--coral-dark` | `#ffabb2` | readable text/link accent |
| `--surface` | `rgba(37,33,51,.80)` | main glass cards |
| `--surface-strong` | `rgba(51,44,64,.95)` | inset cards/form surfaces |
| `--radius` | `32px` | stable across modes |

**Contrast and visual QA:** Dark does **not** mean pure black, high-saturation neon or glowing HUD borders. It uses plum-tinted glass with subdued Coral/Lavender ambient aurora. Coral primary buttons retain darker fills and white labels; pale Coral is an accent, not a low-contrast CTA fill. Verify at 390, 1440 and 1728px on **both** themes; verify Login, Dashboard, data tables, Kanban, Gantt, evidence, settings, all dialogs and print in Dark. Never use `color-scheme: dark` as a substitute for semantic token mapping.
## Public services and mascot — ADR-0003

The approved 2026-10-25 extension adds eight public entrypoints with a header/menu shell variant, while all existing workspace entrypoints move into `/admin/` with their sidebar/topbar retained. Shared CSS, theme state, buttons, icons and dialogs remain authoritative. Ten static transparent PNG mascot reactions are approved on both public and admin surfaces. The public landing hero may use a larger display heading; workspace heading scale is retained. Stronger semantic coral action fills improve text contrast without changing the locked accent tokens. See ADR-0003 and docs/PUBLIC-PORTAL-VERIFICATION.md for evidence and limitations.

### Compact mascot extension

The owner approved ten additional square half-body PNGs for limited-space components on 2026-10-25. Both variants share the same character identity; the hero keeps full-body art. The shared helper defaults to full-body and adds the half-body variant without changing user avatars, theme or workflow authority. Twenty reaction files are registered across two galleries. See docs/COMPONENTS.md and docs/HALF-BODY-MASCOT-VERIFICATION.md.
