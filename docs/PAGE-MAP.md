# Page and Navigation Map — approved 16-screen prototype

The v0.1 baseline has **16 HTML entrypoints**, each sharing one CSS stylesheet and one JS app renderer. Page name is read from `<body data-page>` in `app.js`; the page-title/route/shell and navigation come from that shared file.

| Page key | URL | Purpose | Next related page |
| --- | --- | --- | --- |
| login | `login.html` | demo-only role preview (no real authentication) | Dashboard |
| dashboard | `index.html` | critical operations snapshot, focus tasks, risk and pulse | My Work, Team Board |
| my-work | `my-work.html` | personal queue, filters, create task and CSV | Task Detail |
| task-detail | `task-detail.html?id=IT-2401` | task lifecycle, progress, work log, evidence references | My Work |
| team-board | `team-board.html` | shared six-state Kanban, drag/drop and status selector | Task Detail |
| projects | `projects.html` | portfolio overview and project cards | Project Detail |
| project-detail | `project-detail.html?id=PRJ-01` | milestones, dependencies, objective, task references | Projects, Roadmap |
| roadmap | `roadmap.html` | FY2570 month grid, quarters, milestone plan | Project Detail |
| kpi | `kpi.html` | KPI target/actual and evidence review simulation | Reports |
| reports | `reports.html` | daily/weekly/monthly/executive views, CSV and print | KPI |
| compliance | `compliance.html` | policy controls/owners/mock evidence mappings, no certification | KPI |
| service-desk | `service-desk.html` | IT service tickets, status and new request | My Work |
| notifications | `notifications.html` | inbox, read/unread, deep links | Task Detail |
| people | `people.html` | IT team workload and proposed role matrix | Team Board |
| activity | `activity.html` | simulated activity history and audit guidance | Reports |
| settings | `settings.html` | display density and mock-data reset | Dashboard |

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