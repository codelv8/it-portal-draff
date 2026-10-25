# IT Portal — Aurora Gradient / Coral / Glass / Light + Dark (UX/UI Draft)

**Prototype version:** 0.1.0 · **Data context:** 25 October 2026 (mock date) · **Built with:** Native HTML, CSS, Vanilla JavaScript

A clickable UX/UI draft for a hospital IT work management portal. The approved visual baseline is governed by [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md), [design-config.json](design-config.json) and [docs/COMPONENTS.md](docs/COMPONENTS.md). Run `php scripts/check-design-contract.php` before submitting a UI change. This is a **visual / workflow prototype**, not a production application. All users, projects, metrics, task progress, risk states, governance mapping, and service requests are fabricated examples. **No patient information is included.**

## Quick start

**Option A — Multi-file repository (canonical for new work):** serve `index.html` and all assets over HTTP as shown below. This is the version controlled source of truth. For Agent-driven UI development, change the shared `assets/css/styles.css` and `assets/js/app.js` rather than creating page-local styles.

**Standalone reviewer build:** the separately downloadable `it-portal-aurora-standalone.html` is a convenience export and is intentionally **not committed** to avoid two editable copies of the same UI. Regenerate it from the canonical source whenever needed.

**Start local server:** open `index.html`, or start a local static server for reliable navigation and localStorage:

```bash
cd it-portal-aurora-draft
python -m http.server 8000
```

Visit `http://localhost:8000` (or `/login.html` for the illustrative login).

**Dependencies:** none. No Node, React, Tailwind, PHP server or database is needed for this design review.

## Screens (16 HTML entrypoints)

| HTML file | Screen | Primary interactions |
|---|---|---|
| `login.html` | Login illustration | Preview role selection → demo entry (no auth) |
| `index.html` | Dashboard | Summary, risks, pulse chart, focus tasks, milestones |
| `my-work.html` | My Work | Search, priority/status filters, scopes, status edit, create task, CSV |
| `task-detail.html?id=IT-2401` | Task Detail | Status/progress editing, local work-log notes |
| `team-board.html` | Kanban Board | Drag and drop or status dropdown, workload panel |
| `projects.html` | Project Portfolio | Search cards, view projects |
| `project-detail.html?id=PRJ-01` | Project Detail | Tasks, milestones, strategic objective, evidence references |
| `roadmap.html` | Strategic Roadmap | FY2570 Gantt, quarter filter, milestone schedule |
| `kpi.html` | KPI & Evidence | KPI detail selector, evidence filters, simulated review, CSV |
| `reports.html` | Reports | Daily / Weekly / Monthly / Executive, CSV, print/PDF |
| `compliance.html` | Governance | CTAM+/OWASP/local-policy mock control mapping, filters |
| `service-desk.html` | Service Desk | Ticket filter, view/create ticket, status edit |
| `notifications.html` | Notifications | Read/unread, mark all as read, deep links |
| `people.html` | People & Roles | Workload directory, proposed permissions matrix |
| `activity.html` | Activity | Illustrative event timeline and audit field guidance |
| `settings.html` | Settings | Light/Dark theme choice, compact density, simulated preferences, reset local mock data |

Navigation and core interactions work in the browser. Edits are stored in browser `localStorage` where available. **No server requests are made** by the prototype.

## Design direction (user-provided)

```json
{
  "visualDirection": "Aurora Gradient reference",
  "layout": "portal",
  "surface": "glass",
  "palette": "coral",
  "cornerRadius": 32,
  "mode": "dark",
  "fontFamily": "LINE Seed Sans TH",
  "mascot": {"enabled": false, "styleIndex": null, "animation": null, "style": null}
}
```

Design tokens are in `assets/css/styles.css`: Light lives in `:root`, Dark in `html:not([data-theme="light"])`. Main colors: coral `#f46f75`, peach `#ffd9bd`, lavender `#eee0ff`, mint `#d9f6e9`. Main glass surfaces use `32px` corners with frosted white (Light) and soft charcoal-plum (Dark) materials. UI primitives (buttons, badges, fields) use smaller radii for usability.

### LINE Seed Sans TH

The CSS selects **LINE Seed Sans TH**. The font binaries are **not bundled**; an installed local copy is used if present, otherwise the interface falls back to Noto Sans Thai / Tahoma / system fonts. To enable the exact font on another computer:

1. Download the official LINE Seed TH package from https://seed.line.me/index_th.html and review the SIL Open Font License.
2. Copy the WOFF2 webfont files to `assets/fonts/`, with the filenames `LINESeedSansTH_W_Rg.woff2` and `LINESeedSansTH_W_Bd.woff2` (Regular, Bold).
3. For the one-file standalone HTML, the font may need to be installed locally in the OS, because that file does not include font binaries.

The font directory contains instructions, not font files.

## Demo-data boundaries

- Task due-date and overdue calculations are anchored to the **sample date** `2026-10-25` for repeatable UI review.
- KPI values and project progress are explicitly **fictional**, not calculated production performance indicators.
- CTAM+/OWASP mappings are UI samples and **do not claim compliance**. Compliance assessment and policy versioning must be validated with responsible stakeholders.
- Example evidence records contain **metadata only**. File picker demonstration saves only the filename, never its bytes.
- Role selector is **a UI preview, not RBAC enforcement**. No password, session, MFA, secure file upload, policy approval, or audit evidence mechanism is implemented.
- Local Storage is per browser. Use Settings → Reset mock data to return to the initial examples.
- Exports are mock-data CSV files. Treat them as examples, not official reports.

## Production handoff (proposed)

Retain the UI vocabulary and data flows, then build a server-side Native PHP app:

1. Create authenticated sessions, MFA flow for privileged accounts and server-side role/permission gates.
2. Model users, teams, projects, milestones, tasks, task history/work logs, KPI definitions/measurements, evidence metadata, policy controls, approvals and immutable audit events.
3. Provide PDO prepared statements, CSRF validation, output escaping, secure cookie/session settings, upload validation and storage outside the web root.
4. Connect realistic owners, due dates, baseline values, KPI formulas and approved policy versions before reports go live.
5. Run user acceptance testing with both IT staff and IT leads. Verify backup/restore, secure network access and contingency procedures before production.

**Repository status:** Initial UX/UI baseline and AI-agent design guardrails are version controlled in this repository. Prototype only; no production backend or live records.


## Theme v2 (Dark default / Light optional)

The product owner's 2026-10-25 direction adds Dark to the approved Aurora/Coral/Glass visual system. **New browsers open in Dark**; users may switch Light/Dark from the sun/moon icon in Topbar/Login or Settings → Theme mode. The preference persists separately in `localStorage['it-portal-theme-v1']`, independent from `it-portal-aurora-mock-v2`; resetting mock records does not reset the theme. Appearance is demo-only and does not imply authentication.

Both modes share one HTML/JS/CSS architecture, 32px panel radius and LINE Seed Sans TH. UI additions require screenshots/verification in both modes. See [ADR-0002](docs/decisions/ADR-0002-aurora-dark-mode.md).