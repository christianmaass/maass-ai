# Testing Policy

This document defines the minimal testing expectations for navaa.ai.

## Critical Paths (MUST be tested)

- Auth flows: login/logout, token refresh, role checks (isAdmin, isAuthenticated)
- Unified Guard routing: onboarding gating, enrollment gating, subscription tier gating
- Course enrollment: create, read, update status; progress updates
- Case submission: response submission, scoring write, history read
- API contracts: request/response shape validated

## Test Types

- Unit: pure functions, utilities, mapping functions (schema sync)
- Component: key UI components with state/props (guards, CourseCard, CaseWorkflow parts)
- API: route handlers with request/response validation and error taxonomy
- E2E (optional for now): most critical user journey (login → onboarding → enroll → first case)

## Tools

- Jest + React Testing Library for unit/component tests
- Optional: Playwright for E2E
- Zod for runtime validation of API inputs/outputs

## Minimum Bar

- New/changed critical paths require tests
- Keep tests deterministic, minimal mocks, no network calls (mock fetch/supabase)
- Aim for 70% statements coverage on changed areas; do not block shipping non-critical low-risk changes

## Patterns

- Arrange-Act-Assert structure
- Use data builders/factories for common objects (user, course, enrollment)
- Test error paths with meaningful assertions (error_code, message)

## Commands

- Unit/Component tests (add later): `npm test`
- Type checks: `npm run typecheck`
- Lint: `npm run lint`

## Roadmap

- Add starter Jest config and a few example tests
- Add API contract tests with Zod schemas
- Consider one Playwright E2E smoke test for the main happy path
