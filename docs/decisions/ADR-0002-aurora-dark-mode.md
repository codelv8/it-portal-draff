# ADR-0002 — Dual-Mode Aurora Coral Portal

- **Status:** Accepted by Product Owner, 2026-10-25
- **Decision owner:** IT Portal product owner
- **Supersedes only:** The *Light-only* restriction of ADR-0001 / DESIGN.md v1. The underlying Aurora / Coral / Glass style is retained.

## Context

The initial accepted prototype was Light-only. The owner explicitly requested a second version of the same visual direction with `mode: dark` and `mascot.enabled: false`, to be committed to `codelv8-org/it-portal`.

## Decision

1. Ship **Dark by default** and preserve **Light** as a persistent user choice.
2. Keep one App Shell, CSS, JS, data schema and component library. Dark tokens live in `html:not([data-theme="light"])`; Light is `:root`. UI theme selection is stored in `localStorage['it-portal-theme-v1']` separately from mock records.
3. Preserve Coral, soft Aurora gradients, frosted Glass, 32px radius, LINE Seed Sans TH and `mascot.enabled=false`. Avoid neon/HUD visual styling.
4. Add Topbar/Login toggle, Settings preference, visual regression checks and machine-readable dark token assertions in `design-contract.json`.
5. Maintain ink-on-white print even with Dark selected; apply accessible focus and readable tables/forms/dialogs in both modes.

## Consequences / Trade-offs

- Gain: lower-glare option; preference consistent across pages without two separate themes or frameworks.
- Cost: each new component needs two-mode contrast testing; maintaining hard-coded prototype colors requires careful overrides until fully tokenized.
- Risk: localStorage is not a secure profile preference, and does not synchronize across devices. Browser restrictions may block persistence; the default still works.
- No server-side role, session, MFA or security behavior changes are implied.

## Verification expectation

Run PHP Design Contract, JS syntax check, and browser smoke tests for all 16 pages at desktop/mobile in both themes; verify theme persistence, keyboard toggle and print legibility. A CI source contract does not prove WCAG compliance or complete visual parity.
