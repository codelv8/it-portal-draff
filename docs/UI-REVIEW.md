# UI Acceptance and Anti-Drift Checklist

Use for every changed UI page/component. A checked box is *evidence of a test*, not a promise. Record what was actually verified in the PR.

## 1. Visual identity (P0 for consistency)

- [ ] **Light and Dark** Aurora Gradient/coral/glass directions remain intact; Dark is default; no neon HUD or competing palette.
- [ ] Panel radius matches 32px outer / approved inner radii. No new arbitrary glass effect.
- [ ] LINE Seed Sans TH font stack; official binaries are **not** bundled.
- [ ] Uses `assets/css/styles.css` and existing component classes; no Bootstrap/Tailwind/React/Material overlay.
- [ ] Sidebar, topbar, breadcrumb, page title, CTA, badge and modal follow nearest approved screen.
- [ ] Approved static mascot only (`mascot.enabled=true`, ADR-0003); ten matching transparent PNGs, no decorative icon pack mismatch, no obstruction of controls.

## 2. Interaction and state (P0 for correctness)

- [ ] Main CTA operates; links, search, filters, forms, save, export, close and cancel behave as labeled.
- [ ] Empty and failure states provide readable guidance and next action.
- [ ] Priority/status taxonomy stays intact; status displayed as **text**, not only color.
- [ ] KPI actuals/evidence review and governance mappings are not derived from task progress alone.
- [ ] Mock/fake data always labeled. No real patient, staff credentials, or security secrets.

## 3. Accessibility and layout (P1)

- [ ] Keyboard focus visible and usable; native controls used when possible.
- [ ] Form fields have labels, validation feedback, and programmatic errors as appropriate.
- [ ] Contrast target WCAG AA (normal text >=4.5:1); glass blur does not obscure dense data.
- [ ] At 390px: no global horizontal overflow; mobile drawer works; tables become readable cards.
- [ ] At 900px: navigation and cards adapt; at 1440px and 1728px: layout hierarchy matches baseline.
- [ ] Theme toggle works with keyboard; selection persists across pages/reload and is unaffected by Reset Mock Data. `prefers-reduced-motion` respected; **Dark prints legibly in black on white**.

## 4. Evidence required for a UI PR

- [ ] Run `php scripts/check-design-contract.php` and attach result.
- [ ] Run `node --check` on changed shared JS (if Node available).
- [ ] **Light and Dark** before/after desktop screenshots at **1440px** or **1728px**, same viewport and data state.
- [ ] **Light and Dark** before/after mobile screenshots at **390px**, same viewport and data state.
- [ ] Console errors checked; mouse + keyboard main workflow exercised.
- [ ] Document new component in `docs/COMPONENTS.md`, new page in `docs/PAGE-MAP.md`.
- [ ] If any test unrun, clearly state **Not verified** and reason. Do not report a passing score without evidence.

## 5. Design-change exception

If Product Owner explicitly requests a different visual identity, create a new ADR and update `DESIGN.md`, `design-config.json`, `design-contract.json`, CSS, component docs, screenshots, and migration impact **in the same PR**. Normal feature development is *not* permission to change these values.