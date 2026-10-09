---
trigger: always_on
---

# Backend Development Rules (Node.js + Express + TypeScript)

These rules govern all backend development work in `src/` of this repo. Every developer, agent, and AI assistant must follow them without exception. Violations caught in review are grounds for rejection.

## How to cite a rule in a PR review

Every rule has a stable ID (for example, `A2.1`, `D1.3`). In review comments, cite the rule ID directly:

> "Violates D1.3 - validation is happening in service instead of controller boundary."

Each category lists its enforcement mechanism (ESLint / `tsc` / tests / review-only) so reviewers know what CI catches automatically.

## Table of Contents

- [A. Architecture & Module Structure](#a-architecture--module-structure)
- [B. Server Bootstrap & Runtime Setup](#b-server-bootstrap--runtime-setup)
- [C. TypeScript & Type Safety](#c-typescript--type-safety)
- [D. Routing, Controllers & Validation Boundaries](#d-routing-controllers--validation-boundaries)
- [E. Services, Repository & Result Pattern](#e-services-repository--result-pattern)
- [F. Error Modeling & HTTP Response Contract](#f-error-modeling--http-response-contract)
- [G. Prisma & Data Access](#g-prisma--data-access)
- [H. Naming & File Conventions](#h-naming--file-conventions)
- [I. Imports & Dependency Direction](#i-imports--dependency-direction)
- [J. Security](#j-security)
- [K. Logging & Observability](#k-logging--observability)
- [L. Testing](#l-testing)
- [M. Git & Commits](#m-git--commits)
- [Enforcement Matrix](#enforcement-matrix)
- [PR Review Checklist](#pr-review-checklist)

---

## A. Architecture & Module Structure

Enforcement: review-only.

### A1. Feature modules live in `src/modules/`

- **A1.1** Every backend feature is a self-contained folder at `src/modules/<feature>/`.
- **A1.2** Module internals are split by responsibility: controller, validation/DTO, service, repository, types, and errors.
- **A1.3** Routes are composed from `src/modules/routes/` and mount feature routers explicitly (no dynamic route registration).

### A2. Canonical module shape

- **A2.1** Preferred layout per feature:

```
src/modules/<feature>/
  <feature>.controller.ts
  <feature>.validation.ts   # or <feature>.dto.ts
  <feature>.service.ts
  <feature>.repository.ts
  <feature>.types.ts
  <feature>.errors.ts
```

- **A2.2** Keep business logic out of route files and thin it in controllers.
- **A2.3** Keep persistence logic out of services and controllers; repository owns database details.
- **A2.4** Avoid cross-feature repository imports unless explicitly intentional and documented.

### A3. Route composition and versioning

- **A3.1** Root router exposes health and mounts versioned API routers.
- **A3.2** New endpoints must mount under `/api/v1` unless a deliberate versioning change is approved.
- **A3.3** Path patterns should remain explicit and domain-readable (builder/society/unit hierarchy where applicable).

---

## B. Server Bootstrap & Runtime Setup

Enforcement: review-only + runtime verification.

### B1. Server startup uses `runHttpServer`

- **B1.1** Backend entrypoint (`src/index.ts`) must boot via `runHttpServer` from `@bd-nodejs-be-commons`.
- **B1.2** `beforeListen` performs startup side effects (DB connect, storage init, etc.).
- **B1.3** `shutdownCleanup` must release external resources (Prisma disconnect, queue clients, etc.).
- **B1.4** Startup failures must flow through `exitAfterStartupFailure`.

### B2. Register app middleware intentionally

- **B2.1** Use `registerApp` hooks (for example `securityPreMiddleware`) for global middleware wiring.
- **B2.2** Do not initialize ad-hoc Express apps outside the centralized bootstrap path.
- **B2.3** Keep startup linear and observable (log key milestones with structured logger).

### B3. Configuration

- **B3.1** Configuration is centralized in `app.config` and read once.
- **B3.2** No raw `process.env` reads in feature modules.
- **B3.3** Missing mandatory config should fail fast at startup.

---

## C. TypeScript & Type Safety

Enforcement: ESLint + `tsc --noEmit`.

### C1. Explicit typing

- **C1.1** Public function parameters and return types are explicit.
- **C1.2** Request body/query/params shapes are modeled with dedicated interfaces/types.
- **C1.3** Repository methods return concrete domain types, not untyped Prisma payloads leaking upward.

### C2. Forbidden escape hatches

- **C2.1** Forbidden: `any`, `as any`, `@ts-ignore`, `@ts-expect-error`.
- **C2.2** Avoid blind type assertions; prefer runtime checks in validation/DTO layer.
- **C2.3** `unknown` is allowed only at boundaries and must be narrowed before use.

### C3. Domain types

- **C3.1** Domain-facing unions and interfaces belong in `<feature>.types.ts`.
- **C3.2** Error/status constants and their type helpers belong in `<feature>.errors.ts`.
- **C3.3** Keep transport-level request types separate from persistent/domain entity types when needed.

---

## D. Routing, Controllers & Validation Boundaries

Enforcement: review-only.

### D1. Route layer responsibilities

- **D1.1** Route files only define paths, middleware chain, and handler binding.
- **D1.2** Auth and authorization middleware (`authMiddleware`, `authorize(Action.XXX)`) stay at route level.
- **D1.3** No business logic in route files.

### D2. Controller layer responsibilities

- **D2.1** Controllers are wrapped with `asyncHandler`.
- **D2.2** Controllers parse route params/query and delegate to service.
- **D2.3** Input validation happens at controller boundary via dedicated validation/DTO helpers.
- **D2.4** Controllers return responses using `sendResponse` and resolve status via `resolveErrorStatus` where applicable.

### D3. Validation/DTO rules

- **D3.1** Never trust raw `req.body`; validate and normalize it first.
- **D3.2** Validation functions return typed outputs, preferably via `Result`.
- **D3.3** Field-level error metadata should be included for client-friendly responses.

---

## E. Services, Repository & Result Pattern

Enforcement: review-only + tests.

### E1. Service orchestration

- **E1.1** Services orchestrate business flow (validation outcomes, repository calls, side effects).
- **E1.2** Services should not know HTTP (`Request`, `Response`, status codes).
- **E1.3** Service return shape should be `Result<T>` or compatible typed wrappers from commons.

### E2. Result helpers

- **E2.1** Use `ok(...)` and `err(...)` from commons for success/error propagation.
- **E2.2** Avoid throwing for expected business failures; return typed errors through `Result`.
- **E2.3** Reserve throws for exceptional failures (transaction aborts, infra failures, invariants).

### E3. Repository boundaries

- **E3.1** Repository layer owns Prisma query details and mapping.
- **E3.2** Services consume repository functions, not raw Prisma client operations where avoidable.
- **E3.3** Keep repository functions focused and composable (single query intent per function).

---

## F. Error Modeling & HTTP Response Contract

Enforcement: review-only.

### F1. Error status catalogs

- **F1.1** Each feature defines `<feature>.errors.ts` with code/status/message constants.
- **F1.2** Error codes must be stable and machine-readable.
- **F1.3** Response status mapping should be centralized (for example via `resolveErrorStatus(result, FeatureErrorStatus)`).

### F2. API response shape

- **F2.1** HTTP responses should be sent through `sendResponse` from commons.
- **F2.2** Use explicit success status when non-default (`201` create, etc.).
- **F2.3** Avoid hand-written ad-hoc response envelopes in controllers.

### F3. Error handling behavior

- **F3.1** Do not swallow exceptions silently.
- **F3.2** Log failures with context before returning mapped errors.
- **F3.3** Never leak raw stack traces or sensitive internals to API consumers.

---

## G. Prisma & Data Access

Enforcement: review-only + tests.

### G1. Prisma usage rules

- **G1.1** Use centralized Prisma config (`src/modules/app/prisma.config`) instead of creating new clients.
- **G1.2** Use transactions when modifying multiple dependent records.
- **G1.3** Keep relation connect/disconnect/update payload construction in repository/service with explicit intent.

### G2. Data normalization

- **G2.1** Normalize user input before persistence (trim, case normalization, defaults).
- **G2.2** Enforce uniqueness and scope constraints before writes.
- **G2.3** For list endpoints, cap page size and sanitize pagination inputs.

---

## H. Naming & File Conventions

Enforcement: review-only.

- **H1.1** Folder names: kebab-case (`society-resource`, `user-profile`).
- **H1.2** Backend files: `<feature>.<layer>.ts` (`vehicle.service.ts`, `vehicle.validation.ts`).
- **H1.3** Boolean variables: `is/has/should/can` prefix.
- **H1.4** Constants: `SCREAMING_SNAKE_CASE`; exported constant groups may use `PascalCase` object names by existing codebase convention.
- **H1.5** Avoid vague names (`data`, `item`, `result`) without domain qualifier.

---

## I. Imports & Dependency Direction

Enforcement: ESLint + review-only.

- **I1.1** Prefer absolute `src/...` imports for cross-module references.
- **I1.2** Keep dependency direction one-way: routes -> controller -> service -> repository.
- **I1.3** Avoid circular imports; extract shared types/constants to dedicated files.
- **I1.4** Keep imports grouped and clean; remove unused imports before commit.

---

## J. Security

Enforcement: review-only.

- **J1.1** All protected routes must include authentication and authorization middleware.
- **J1.2** Validate/sanitize all user-provided input at API boundary.
- **J1.3** Never log secrets, tokens, passwords, or sensitive PII.
- **J1.4** Never commit `.env`, secrets, service account keys, or credentials.
- **J1.5** Keep `BYPASS_AUTH` usage limited to non-production and dev workflows.

---

## K. Logging & Observability

Enforcement: review-only.

- **K1.1** Use commons `logger`; avoid ad-hoc `console.log` in production code.
- **K1.2** Log with context (feature, IDs, action, error code) to support incident debugging.
- **K1.3** Request lifecycle logging should rely on commons middleware and request context.
- **K1.4** Health endpoints should remain lightweight and stable for probes.

---

## L. Testing

Enforcement: review-only + CI tests.

- **L1.1** Validation/DTO functions must have focused unit tests.
- **L1.2** Service logic must be covered for success and error paths.
- **L1.3** Repositories should be validated with integration-style tests where practical.
- **L1.4** New endpoints should include at least one handler-level test covering expected response shape.

---

## M. Git & Commits

Enforcement: Husky + CommitLint.

- **M1.1** Commit messages follow Conventional Commits.
- **M1.2** Pre-commit hooks must pass (lint/format/test gates where configured).
- **M1.3** Do not bypass hooks using `--no-verify`.
- **M1.4** Never force-push to `main`.

---

## Enforcement Matrix

| Category                                  | ESLint | `tsc` | Tests | Husky | Review |
| ----------------------------------------- | :----: | :---: | :---: | :---: | :----: |
| A. Architecture & module structure        |        |       |       |       |   ✓    |
| B. Server bootstrap & runtime setup       |        |       |       |       |   ✓    |
| C. TypeScript & type safety               |   ✓    |   ✓   |       |       |   ✓    |
| D. Routing/controller/validation boundary |        |       |   ✓   |       |   ✓    |
| E. Service/repository/result pattern      |        |       |   ✓   |       |   ✓    |
| F. Error modeling & response contract     |        |       |   ✓   |       |   ✓    |
| G. Prisma & data access                   |        |       |   ✓   |       |   ✓    |
| H. Naming & file conventions              |        |       |       |       |   ✓    |
| I. Imports & dependency direction         |   ✓    |       |       |       |   ✓    |
| J. Security                               |        |       |       |       |   ✓    |
| K. Logging & observability                |        |       |       |       |   ✓    |
| L. Testing                                |        |       |   ✓   |       |   ✓    |
| M. Git & commits                          |        |       |       |   ✓   |        |

---

## PR Review Checklist

1. **B1** - Is server boot wired through `runHttpServer` with proper startup/shutdown hooks?
2. **A2 / D1** - Are route files thin and free of business logic?
3. **D2 / D3** - Are request bodies validated before service calls?
4. **E1 / E2** - Does service return typed `Result` (`ok`/`err`) instead of ad-hoc throws?
5. **E3 / G1** - Is Prisma access kept in repository or intentionally constrained service boundaries?
6. **F1 / F2** - Are error codes/status mappings centralized and responses sent via `sendResponse`?
7. **C2** - Any `any`, suppressions, or unsafe assertions?
8. **J1.1** - Are protected routes guarded with auth + authorize middleware?
9. **K1.1** - Any stray `console.log` or missing structured logging context?
10. **L1** - Are critical success/failure paths covered by tests?

---

## Summary of Forbidden Patterns

| Pattern                                         | Rule  | Why                                      |
| ----------------------------------------------- | ----- | ---------------------------------------- |
| Business logic in route files                   | D1.3  | Breaks separation of concerns            |
| Using raw `req.body` without validation         | D3.1  | Security and correctness risk            |
| Returning ad-hoc response envelopes             | F2.3  | Inconsistent API contract                |
| Creating ad-hoc Prisma clients                  | G1.1  | Connection lifecycle and config drift    |
| `any` / `@ts-ignore` / `@ts-expect-error`       | C2.1  | Type safety bypass                       |
| Swallowing errors silently                      | F3.1  | Debugging blind spots                    |
| Missing auth/authorize on protected endpoints   | J1.1  | Access control risk                      |
| Logging secrets/tokens/PII                      | J1.3  | Security incident risk                   |
| Direct `process.env` reads inside feature files | B3.2  | Config inconsistency and runtime fragility |
| Force push to `main`                            | M1.4  | Repository safety                        |
