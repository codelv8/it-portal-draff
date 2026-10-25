# Agent Instructions — IT Portal

**Must read before writing UI:** `DESIGN.md` -> `design-config.json` -> `docs/COMPONENTS.md` -> `docs/PAGE-MAP.md` -> `docs/UI-REVIEW.md`. This applies to Codex, Claude, Cursor, GitHub Copilot and all automated coding agents.

## Non-negotiables

1. **Preserve Aurora / coral / glass / light**. The v0.1 design was selected. Do not use the old dark HUD direction or import a fresh design system.
2. **Native HTML/CSS/Vanilla JS, with Native PHP later.** No React, Vue, Angular, Tailwind, Bootstrap, shadcn, icon packs, dependency CDNs or new build chain without explicit approval.
3. **One app shell and one theme**: reuse `assets/css/styles.css`, `assets/js/app.js`, sidebar, topbar, `glass card`, buttons, badges, forms and existing inline SVG `icon(name)` helper. A new module is not a new product.
4. **Tokens are locked**: maintain `--coral:#f46f75`, `--bg:#fbf8f8`, `--radius:32px`, LINE Seed Sans TH fallback stack, light glass surface, mascot disabled. See `design-contract.json`.
5. **Demo stays demo**: never present synthetic KPI, audit, security or CTAM+/OWASP evidence as verified. Never infer server auth from demo role selector or localStorage.
6. **Accessibility and responsive**: visible focus, labels, readable contrast, states not color-only, keyboard interaction, 390px mobile and >=1440px desktop. No new horizontal page scroll except intentionally scrollable Kanban/Gantt.
7. **No secrets/PHI** in code, demo fixtures, screenshots, commits or logs. Treat production authentication, MFA, audit and RBAC as separate backend implementation requirements.

## Workflow for each change

- State target page, user job-to-be-done, related baseline screen, expected states and data source.
- Make the smallest coherent change using shared components; never copy-paste entire CSS into a page or invent another panel/button style.
- If new reusable primitive is genuinely required, update `docs/COMPONENTS.md` and document its tokens and states.
- If adding a page, update `docs/PAGE-MAP.md`, nav/route handling, labels and responsive behavior.
- Run `php scripts/check-design-contract.php`; run JS syntax checks (`node --check assets/js/app.js` and `node --check assets/js/mock-data.js`) when Node is present.
- Visually compare desktop 1440/1728 and mobile 390 at equal viewport widths; capture before/after screenshots, inspect console errors and include findings in PR.
- Use `.github/PULL_REQUEST_TEMPLATE.md`. If a UI test could not run, write `Not verified` with reason, not `Passed`.

## PHP handoff

Keep server-side session identity, authorization, policy versioning, KPI measurements, evidence metadata and append-only audit events separate from frontend preview state. Use PDO prepared statements, CSRF checks, contextual output escaping, secure session cookies, upload allow-lists, private file storage and backend permission checks. Never promote localStorage examples into production evidence.

**When instructions conflict:** follow explicit latest user approval; otherwise DESIGN.md and `design-config.json` are the baseline. Ask for a design-change decision instead of quietly replacing the visual system.