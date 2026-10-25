# Half-body mascot extension — verification

Date: 2026-10-25 (Asia/Bangkok). This adds to the existing uncommitted public-portal work; that work was preserved. No commit, push, production deployment, backend, new product dependency or animation was introduced.

## Delivered artwork and usage

- Ten new original PNG reactions: welcome, guide, typing, repair, success, question, warning, sorry, loading and thanks. Each has a **1254×1254 square RGBA canvas**, alpha range **0–255**, transparent corners and no text/watermark/sticker border. Face, coral polo, glasses, haircut and ID badge match the existing character. Half-body framing intentionally ends at the waist.
- [PNG directory and exact prompt manifest](../assets/images/mascot/half-body/prompts.json). Generated using built-in `image_gen`, one master based on the original welcome artwork, then nine identity-preserving variants based on that half-body master. No post-generation pixel edits were made.
- [Dark overview](../assets/images/mascot/half-body/overview.png), [Light overview](review/half-body/overview-light.png). These supplementary overview PNGs are rendered contact sheets, not additional reaction assets.
- Shared helper: `mascot(reaction, className, variant='full')`. Hero/large artwork still uses the full-body default. Toast now uses half-body success/thanks at 40px, sidebar typing at 64px, mobile Login welcome at 64px and public resource-detail guide/warning at 96px.
- Settings has separate full-body and half-body galleries, ten reactions each, exact 32/40/48/64/96px examples and 32/40/48px circular assistant-avatar examples. Existing personnel initials and `av()` are unchanged.

## Actual checks

| Check | Result |
|---|---|
| PNG validation | **20/20** registered reaction files passed format, alpha and background checks; ten compact files are square |
| Original artwork | **10/10 full-body PNGs byte-identical** by SHA-256 comparison with the pre-change snapshot |
| Design contract | `UI DESIGN CONTRACT PASSED (structural only; visual screenshots still required).` |
| JavaScript syntax / PHP lint | Passed for changed shared/render/test scripts and the design checker |
| Compact Chrome suite | **149 checks passed**, **44 screenshots**, Dark/Light at 390/900/1440/1728px |
| Whole-portal regression | **1,079 checks passed**, **192 rendered states**, **55 screenshots** |
| Console, page JS and HTTP errors | **0** captured by each final browser suite |
| Before evidence | 12 pre-change states captured for Login, sidebar/Dashboard and resource modal, Dark/Light at 390/1440px |

Asset checking intentionally preserves an existing **1/255 alpha value in one corner of the old full-body typing image**. New half-body corners are required to be exactly zero; no original file was altered to satisfy the new test. The asset-check report records per-image dimensions, alpha, corners and hashes.

Compact checks exercise real component sources/dimensions, `object-fit:contain`, both galleries, circular clipping, overflow, visible toast text, mobile Login, resource-modal fit, unchanged personnel avatars and the unchanged full-body Home hero. Synthetic test tasks are created only in the isolated test browser context.

## Visual review and trade-offs

Reviewed the ten reactions on Dark and Light contact sheets, all ten at five rendered sizes, circular welcome avatars, mobile modal, mobile toast, Login and sidebar. Face/glasses and large gestures remain visible at 32px, but small tools and finger positions are inherently less distinct. Use 40/48px for reactions and 64/96px for detailed illustrations, and always retain a text label/status. Circular examples intentionally crop toward the face; sticker and component artwork uses contain without cropping.

- [All sizes — Dark](review/half-body/size-matrix-dark.png)
- [All sizes — Light](review/half-body/size-matrix-light.png)
- Login 390 Dark: [before](review/half-body/before-login-dark-390.png) / [after](review/half-body/after-login-dark-390.png)
- Resource modal 390 Dark: [before](review/half-body/before-modal-dark-390.png) / [after](review/half-body/after-modal-dark-390.png)

The before states and full compact output are under local, Git-ignored `test-results/half-body/`; selected review images above are included in the repository. The size-matrix capture uses a temporary, test-only layout inside the real Settings gallery to render every image at all five sizes. It does not add that large matrix to the product.

## Limits, reproduction and rollback

Better Design discovery, UI/UX principles, review rules, comprehension and spacing were attempted, but returned **`HTTP 402: AGENT_QUOTA_EXHAUSTED`**. Better Design review/spacing approval is **Not verified**. No dashboard approval receipt or public preview was created. Full WCAG/screen-reader testing, other browsers, physical devices and production UAT are also **Not verified**; the evidence is local Chrome rendering and interaction.

With the repository's existing static server running and the installed Playwright exposed through `NODE_PATH`, run:

```powershell
php scripts/check-design-contract.php
python scripts/check-mascot-assets.py
node scripts/check-mascot-compact.cjs
node scripts/check-portal-browser.cjs
```

Pillow is used only by the optional asset checker. Browser scripts default to `http://127.0.0.1:8127`; override `PORTAL_TEST_URL` for another local server. No package was added to the product.

Rollback only this additive compact extension: restore the pre-extension shared helper/styles/config/checker snapshot and remove the half-body registrations and assets. Preserve the prior uncommitted public portal and the original full-body images; do not run a repository-wide reset or clear browser data. The local pre-extension source snapshot and original hashes are under `test-results/half-body/`.
