## Purpose / user outcome

What user problem does this solve? Which Staff / IT Lead / Admin workflow changes?

## Baseline reuse

- Related existing screen:
- Reused primitives from `docs/COMPONENTS.md`:
- New shared component (if any) and why existing patterns are insufficient:
- Updated `docs/PAGE-MAP.md` (if new screen):

## Design contract

- [ ] Matches `DESIGN.md`: Aurora Gradient / coral / glass / **Dark default + Light option** / 32px / LINE Seed Sans TH / approved static mascot (ADR-0003)
- [ ] Uses shared app shell and tokens, no new UI framework or visual theme
- [ ] Any intentional visual change has an approved ADR

## Verification (include evidence or "Not verified")

- Design guard: `php scripts/check-design-contract.php` ->
- JS syntax if applicable ->
- Desktop before/after images (1440 or 1728) in Light **and** Dark ->
- Mobile before/after images (390) in Light **and** Dark ->
- Keyboard, focus, validation, empty/error states ->
- Console errors ->

## Data / security boundaries

- [ ] No credentials, PHI or production policy/evidence claims in fixtures
- [ ] Mock data clearly labeled; real backend authority enforced separately
- [ ] No new dependencies or network calls without review

## Risk / rollback

Potential regressions, impacted screens and a rollback step: