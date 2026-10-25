# IT Portal Component Catalog (approved baseline)

**Reference:** `assets/css/styles.css` and `assets/js/app.js`. The components below already exist in the v0.1 prototype. Reuse them before creating an alternative.

## Design primitives

| Component / role | Selector or helper | Rules |
| --- | --- | --- |
| App shell | `.app-shell` | single sidebar + `.workspace`; reuse on every authenticated page |
| Side navigation | `.sidebar`, `.nav-link`, `.nav-link.active` | same navigation hierarchy, coral selected fill, mobile drawer |
| Topbar | `.topbar`, `.breadcrumb`, `.top-actions`, `.theme-toggle` | breadcrumbs, search, Light/Dark toggle, notifications, role preview |
| Panel | `.glass.card` | Light frosted-white / Dark plum glass, soft border and shadow; radius 32px |
| Inset grouping | `.surface` | neutral strong surface with small radius |
| Page title | `.page-heading`, `.page-title`, `.page-subtitle`, `.eyebrow` | modest app headline; not a marketing hero per page |
| Standard section | `.section-head`, `.section-title`, `.section-desc` | 24px card padding on desktop |
| Buttons | `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-soft`, `.btn-danger`, `.btn-sm` | one primary CTA per flow; use clear labels |
| Icon-only button | `.icon-button` | 40x40; accessible title/label; existing SVG icons |
| Inputs | `.field`, `.input`, `.select`, `.textarea`, `.input-search` | explicit labels, focus ring, validation text |
| Filters | `.filters`, `.pill-tabs`, `.tab`, `.tab.active` | selected fill, not underline-only |
| Metrics | `.metrics`, `.metric` | use sparingly; actual values must come from legitimate data source |
| Status | `.badge` variants | status meaning always appears as text |
| Tables | `.table-wrap`, `.task-table` | responsive record-card transform on narrow widths |
| Task board | `.kanban-board`, `.kanban-col`, `.kanban-card` | horizontal scrolling inside board only; accessible alternate status selector |
| Roadmap | `.gantt`, `.gantt-row`, `.gantt-bar` | accessible labels and scroll within chart region |
| Dialog | `.modal-backdrop`, `.modal`, `.modal-head`, `.modal-actions` | focus, Escape, cancel, validation |
| Feedback | `.toast-holder`, `.toast`, `.empty-state` | timely plain-language feedback; no silent failures |
| Theme choice | `.theme-choice`, `.theme-option` | Settings Light/Dark selection, `aria-pressed`, single persisted preference |
| Misc | `.progress`, `.progress-line`, `.grid-2`, `.grid-3`, `.grid-4` | reuse existing display conventions |
| Icons | JS `icon(name, size=19)` | reuse existing inline SVG inventory; do not mix emoji or new packs |

## Approved compositions

**Card with a section header**

```html
<section class="glass card">
  <div class="section-head">
    <div>
      <h2 class="section-title">งานที่ต้องติดตาม</h2>
      <p class="section-desc">สถานะจากชุดข้อมูลตัวอย่าง</p>
    </div>
    <a class="small-link" href="my-work.html">ดูทั้งหมด</a>
  </div>
  <!-- Task list uses shared typography, badges and progress components. -->
</section>
```

**Action pattern**

```html
<div class="page-actions">
  <button type="button" class="btn btn-primary">เพิ่มงานใหม่</button>
  <button type="button" class="btn btn-outline">ส่งออก CSV</button>
</div>
```

**Labeled field**

```html
<div class="field">
  <label for="work-title">ชื่องาน</label>
  <input id="work-title" name="title" class="input" required maxlength="160">
  <small class="help">ระบุผลส่งมอบที่ตรวจสอบได้</small>
</div>
```

**Standard page entrypoint** — page shells are composed in `app.js`, not duplicated by each HTML file:

```html
<!doctype html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body data-page="new-page">
  <div id="app"></div>
  <script src="assets/js/mock-data.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
```

## State rules

- Always provide initial, empty, loading (if async), filtered-empty, validation/error, disabled and success feedback where relevant.
- Task status strings are canonical; no invented synonyms or status colors. `Blocked` is not interchangeable with `At Risk`.
- When implementing a new interactive control, provide keyboard and mobile fallback (Kanban DnD requires a status dropdown too).
- Use semantic HTML (`button`, `a`, `label`, `table`, `th`, `nav`, `main`) before adding ARIA. Do not render placeholder actions that do nothing.
- Avoid styles like `style="color:#..."` in new UI; use theme variables, existing status classes, or documented semantic variants.

## Extending the catalog

Create a new primitive only when none above fits. Document its purpose, markup, token usage, variants, focus/hover/disabled/error states, mobile behavior and expected screenshot. Update the central CSS/JS implementation, never leave a one-off component styling fork in an HTML page.

## Theme v2 extension rule

All components must work in `data-theme="light"` **and** `data-theme="dark"`. Default is Dark when no preference is saved. Toggle exists in Topbar and Login; Settings has a two-choice appearance selector. Use the central `assets/css/styles.css` and root design tokens rather than separate stylesheets. Reuse `themeButton()` and `setTheme()` from the shared JS; do not create a new preference key or attach theme choice to mock data. Test contrast, keyboard focus, empty states, nested surfaces, mobile and print on both themes.