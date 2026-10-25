# Page and Navigation Map — Public services + Admin workspace

## Quick Launch overlay (shared admin flow)

Every admin workspace entrypoint except `admin/login.html` exposes a floating “เมนูลัด” button. It opens a fullscreen **Quick Launch Menus** dialog without changing route or replacing the app shell. Search → system/personal card → destination; Add/Edit → shared modal → saved personal card; Delete → confirmation → removed card. System cards use the navigation routes below; personal cards accept internal paths or HTTP(S) URLs. Closing returns to the same page, with underlying filters and workspace state preserved. Public pages and legacy redirects do not add a second launcher.

The current version has **8 public entrypoints** and **16 admin entrypoints**, sharing one CSS stylesheet and the central theme/icon/modal implementation. Page name is read from `<body data-page>` in `app.js`; the page-title/route/shell and navigation come from that shared file.

| Page key | URL | Purpose | Next related page |
| --- | --- | --- | --- |
| login | `admin/login.html` | demo-only role preview (no real authentication) | Dashboard |
| dashboard | `admin/index.html` | critical operations snapshot, focus tasks, risk and pulse | My Work, Team Board |
| my-work | `admin/my-work.html` | personal queue, filters, create task and CSV | Task Detail |
| task-detail | `admin/task-detail.html?id=IT-2401` | task lifecycle, progress, work log, evidence references | My Work |
| team-board | `admin/team-board.html` | shared six-state Kanban, drag/drop and status selector | Task Detail |
| projects | `admin/projects.html` | portfolio overview and project cards | Project Detail |
| project-detail | `admin/project-detail.html?id=PRJ-01` | milestones, dependencies, objective, task references | Projects, Roadmap |
| roadmap | `admin/roadmap.html` | FY2570 month grid, quarters, milestone plan | Project Detail |
| kpi | `admin/kpi.html` | KPI target/actual and evidence review simulation | Reports |
| reports | `admin/reports.html` | daily/weekly/monthly/executive views, CSV and print | KPI |
| compliance | `admin/compliance.html` | policy controls/owners/mock evidence mappings, no certification | KPI |
| service-desk | `admin/service-desk.html` | IT service tickets, status and new request | My Work |
| notifications | `admin/notifications.html` | inbox, read/unread, deep links | Task Detail |
| people | `admin/people.html` | IT team workload and proposed role matrix | Team Board |
| activity | `admin/activity.html` | simulated activity history and audit guidance | Reports |
| settings | `admin/settings.html` | display density and mock-data reset | Dashboard |

## Information architecture

```text
IT Portal
  Workspace      Dashboard | My Work | Team Board
  Planning       Projects | Roadmap | KPI & Evidence | Reports
  Operations     Compliance | Service Desk | Notifications
  Administration People & Roles | Activity | Settings
  Details        Task Detail | Project Detail (nested routes)
  Demo           Login (illustrative only)
```

## New screen acceptance

1. Unique `data-page` key, HTML entrypoint and `paths` entry in `app.js`.
2. Correct `headings` record, appropriate sidebar `navigation` placement and `renderPage()` handler.
3. Existing shell, breadcrumb, demo banner, footer and readable keyboard navigation.
4. At least populated/empty/error state; if a module contains forms, show validation and successful feedback.
5. Desktop 1440 / 1728 and mobile 390 visual comparison to an existing related screen.
6. Updated this file and `docs/COMPONENTS.md` if any new reusable pattern appears.

**No page may introduce its own dark theme, alternate sidebar, font, badge system or card corner radius.**

## Public services — approved 2026-10-25 (ADR-0003)

| Page key | URL | Purpose |
|---|---|---|
| home | `/index.html` or `/` | Welcome, service shortcuts, mock duty and announcements |
| duty | `/duty.html` | Month selector, synthetic shift calendar and detail modal |
| portal | `/portal.html` | Searchable service catalog and category filter |
| announcements | `/announcements.html` | Searchable mock news with detail modal |
| guide | `/guide.html` | Searchable practical sample guides |
| e-learning | `/e-learning.html` | Sample reading lessons; no video or certification |
| hait | `/hait.html` | Sample quality-information resources; no accreditation claim |
| digital-policy | `/digital-policy.html` | Sample policy topics; no approved-policy or legal claim |

Public entrypoints load public-data.js and public.js before app.js. Public and admin use `data-area` and explicit page keys. `/admin/` uses its real directory index without rewrite configuration. Legacy root workspace URLs redirect into admin, preserving query strings and hash fragments. `/index.html` is now Home, not a Dashboard alias. Existing storage keys remain unchanged. Root compatibility URLs are not additional maintained product screens.
