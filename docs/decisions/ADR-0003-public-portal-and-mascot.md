# ADR-0003 — Public portal, admin directory and static IT mascot

Status: Accepted by explicit product-owner request, 2026-10-25.

The owner approved implementation of the reviewed plan: add Home and seven public service/resource pages inspired by the supplied local static clone, move the entire existing workspace including Login into `/admin/`, use IT Portal branding and synthetic data, and enable ten matching static chibi/anime IT-worker reactions in public and admin views.

The character is an adult male with short black student haircut, black glasses, coral polo, charcoal trousers and plain ID badge. Ten reactions: welcome, guide, typing, repair, success, question, warning, sorry, loading and thanks. Transparent PNGs contain no copy. Images remain supplementary to text and do not animate or obstruct frequent tasks. This explicitly supersedes the earlier mascot-disabled constraint; it does not change Aurora/coral, Dark default, Light support, radius, font or the native stack.

Public pages use a header/menu layout variant while admin keeps its existing sidebar/topbar. Both use the same stylesheet, theme preference, icons and modal code. Real directory indexes support static hosting. Compatibility redirects retain old workspace query/hash links. Existing mock browser records and theme keys are retained. Root index now means public Home.

No backend, database, real staff schedule, credential handling, production RBAC or certification is introduced. No production deployment is included. Any public design-review preview must contain synthetic data only.

Rollback: revert this scoped change through Git to restore the original root workspace and disabled-mascot contract; do not erase browser storage. Generated master sources remain in the local image-generation output folder. Curated external knowledge-base architecture/security/database/deployment notes are not modified.

## Subsequent approved compact extension (2026-10-25)

The owner explicitly approved ten additional half-body reactions for stickers, assistant avatars and limited-space components, plus their integration into toast, sidebar, mobile Login and compact public-detail modals. The original ten full-body assets remain intact; the default helper variant and hero remain full-body. Transparent square canvases and 32/40/48/64/96px component sizes make the face and hands more visible. Circular examples depict the IT assistant and do not replace real/demo personnel identities. This is an additive static-art extension; all existing native-stack, theme, synthetic-data and backend boundaries remain unchanged.
