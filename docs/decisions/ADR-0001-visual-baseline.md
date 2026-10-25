# ADR-0001 — Adopt Aurora Coral Light Glass as IT Portal UI Baseline

- Status: **Accepted for UX/UI prototype**
- Date: 2026-10-25
- Owner: IT Portal product owner (user-approved visual direction)
- Applies to: all future modules, components and UI screens

## Decision

Adopt a light portal UI with coral aurora gradients, translucent glass surfaces, 32px outer panel radius, LINE Seed Sans TH and no mascot. Use the existing v0.1 16-screen native HTML/CSS/JavaScript prototype as the implementation reference, locked via `design-config.json`, `design-contract.json` and the PHP guardrail script.

## Why

The owner explicitly preferred the revised Aurora UI over the preceding dark Futuristic HUD variant. A consistent component family helps IT staff and IT leads recognize tasks, priorities, statuses and evidence without re-learning visual patterns per module.

## Trade-offs

- Gain: calm, inviting consistent shell; reusability and consistent UX across 16 screens.
- Cost: translucent surfaces need extra care with contrast, dense data and print legibility.
- Mitigation: stronger text/surface tokens, dedicated record/card patterns, responsive and accessibility review.

## Change policy

An agent may not reverse this decision as part of normal feature work. A proposed visual-direction change must include owner approval, revised design tokens and screenshots at desktop/mobile and an explicit migration note for existing pages.

No compliance or production readiness conclusion is implied by this visual design decision.