# Public portal + admin relocation — verification

Date: 2026-10-25 (Asia/Bangkok). Source baseline: `024e6cffb483f1041adce8a8e650ac2e435983a5`, branch `main`; working tree was clean before this change. Implementation remains uncommitted and has not been pushed or deployed to production.

## Purpose / user outcome

Public Home and seven service/resource pages provide an IT Portal entry point for staff. The sixteen original workspace screens, including demo Login, are served under the real `/admin/` directory. Fifteen legacy root workspace URLs redirect with query/hash preserved; `/index.html` now serves Home. No rewrite configuration is required. Data and personnel are synthetic, not copied from the supplied CKHOS reference.

## Baseline reuse and approved differences

- Existing Aurora/coral/glass tokens, Dark default and Light choice, 32px panel radius, LINE Seed Sans TH stack, buttons, fields, icons, modal host and admin sidebar/topbar are retained.
- Public pages use a header/menu shell variant. New catalog/calendar compositions use shared primitives. ADR-0003 records the owner's approval for this layout and ten static mascot reactions on both public/admin pages.
- Primary button fills use stronger semantic coral shades for white-label contrast: Light `#be4355` (5.09:1 against white), Dark `#b7435d` (5.28:1). Locked accent colors are unchanged. Hover does not move button targets. Public supporting text and keyboard focus use theme tokens.
- Login's theme control and Home return link remain available on mobile; a compact welcome mascot appears there. Shared modals trap Tab and return focus to the opener. Print uses dark text on white and removes controls/character art.
- Fonts are resolved locally with the approved fallback stack. Absent optional WOFF2 URLs are no longer requested; licensed binaries are not bundled.

## Verification results

| Check | Observed result |
|---|---|
| `php scripts/check-design-contract.php` | `UI DESIGN CONTRACT PASSED (structural only; visual screenshots still required).` |
| JS syntax | Passed for app.js, mock-data.js, public-data.js, public.js, redirect.js and browser verification script |
| Chrome / Playwright | **1,078 checks passed**, **192 rendered states**, **55 screenshots** |
| Viewport matrix | 24 product pages × 390 / 900 / 1440 / 1728px × Dark / Light |
| Layout, primary controls and assets | No global horizontal overflow; rendered primary-label contrast >=4.5:1; every page's images decoded |
| Errors | Zero captured page JS errors, console errors and HTTP >=400 responses in the final browser run |
| Routes | Rendered local links return HTTP 200; all 15 compatibility redirects preserve sample query/hash; task/project deep links stay within admin |
| Browser state | Legacy note and stored fields retained on the same origin; theme persists public → admin and survives mock reset |
| Public workflows | Search, category filter, reset/empty state, resource/news modal, focus wrap/restore, mobile menu/Escape |
| Calendar | February 2028 renders 29 days; November 2026 renders 30; date detail reflects selected month |
| Admin regression | Demo Login, keyboard theme control on mobile Login, required title validation, create/search task, Kanban status selector, project detail and CSV export |
| Print / motion | Home and reports checked in both themes; white page and readable paragraph colors; reduced-motion content remains available |
| Mascot assets | Ten distinct 1024×1536 RGBA PNGs; alpha range 0–254 in each; transparent perimeter and consistent character/poses visually checked in gallery |

The browser run uses an isolated Chrome context. It never reads or changes the user's existing browser profile, hospital database or production systems. Stored-record continuity applies only when scheme/host/port stay the same.

## Visual evidence

Eight baseline Dashboard images were captured before changes. The final browser output contains 55 screenshots under local, Git-ignored `test-results/portal/`, plus JSON check/layout/error results. Thirteen selected before/after/Home/gallery images are included in `docs/review/public-portal/`.

| Evidence | Dark | Light |
|---|---|---|
| Home, desktop 1440 | [View](review/public-portal/home-dark-1440.png) | [View](review/public-portal/home-light-1440.png) |
| Home, mobile 390 | [View](review/public-portal/home-dark-390.png) | [View](review/public-portal/home-light-390.png) |
| Dashboard before, 1440 | [View](review/public-portal/before-dashboard-dark-1440.png) | [View](review/public-portal/before-dashboard-light-1440.png) |
| Dashboard after, 1440 | [View](review/public-portal/after-dashboard-dark-1440.png) | [View](review/public-portal/after-dashboard-light-1440.png) |
| Dashboard before, 390 | [View](review/public-portal/before-dashboard-dark-390.png) | [View](review/public-portal/before-dashboard-light-390.png) |
| Dashboard after, 390 | [View](review/public-portal/after-dashboard-dark-390.png) | [View](review/public-portal/after-dashboard-light-390.png) |

[Ten-reaction gallery](review/public-portal/mascot-gallery.png). Final generation used built-in `image_gen`; [exact prompt manifest](../assets/images/mascot/prompts.json) and ten separate PNGs are in `assets/images/mascot/`. Original generated sources remain outside the repository in the local image-generation folder. No image bytes were edited after generation.

Reviewed screenshots include Home desktop/mobile in both themes, light desktop catalog, dark mobile calendar, dark admin Dashboard and Settings/gallery, mobile Login and print output. This is a scoped visual review, not a claim that every screen/state passed a full accessibility audit.

## Not verified / limitations

- Better Design discovery, UI/UX principles, review rules, comprehension and spacing calls were attempted, but returned **`HTTP 402: AGENT_QUOTA_EXHAUSTED`**. No completed Better Design spacing report or `VALID` dashboard-review receipt exists. No public HTTPS preview was deployed for that unavailable review.
- Automated axe/full WCAG audit, screen-reader testing, Safari/Firefox, physical devices, print pagination/PDF output and authenticated production UAT: **Not verified**. Chrome viewport and print-media rendering are the evidence above.
- `it-portal` is absent from the canonical knowledge-base registry and graph index. Source was inspected directly at the user-supplied, Git-verified root. No registry or protected external architecture/security/database/deployment notes were changed.
- This is still a static prototype: no real authentication, RBAC, request delivery, video, file download, database, approved policy or certification. Empty/missing-real-service content explains that boundary.

## Reproduce and rollback

Serve the repository root using the existing README static-server instructions. With an already installed Playwright and Chrome, expose its package through `NODE_PATH` and run `node scripts/check-portal-browser.cjs`. The default test URL is `http://127.0.0.1:8127`; set `PORTAL_TEST_URL` to the local server origin if different. The test creates only local review artifacts and isolated browser mock data; it adds no product dependency/build chain.

Review the scoped Git diff before reverting this change. Reverting restores root workspace routes, the previous visual contract and disabled mascot behavior. Do not erase browser storage as part of rollback. No database or production rollback is needed.
