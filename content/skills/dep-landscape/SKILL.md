---
name: dep-landscape
description: "Map external dependencies — what they do, which are critical, version health, and upgrade pressure. Use when entering an unfamiliar project, evaluating tech debt, or before a major upgrade. Supports depth hints: shallow (critical deps only) or deep (full landscape audit)."
---

# Dependency Landscape

Map this project's dependency landscape. Do NOT just list packages — categorize, prioritize, and assess health. Focus on what a developer needs to know to work confidently with this codebase's foundations.

## Input

The user provides one of:
- Nothing — analyze all dependencies
- A specific concern ("are there security issues?", "what ORM does this use?", "is anything deprecated?")
- A depth hint: `shallow` (critical deps, 2-3 minutes) or `deep` (full audit, 10+ minutes)

Default depth is **shallow**.

## Process

### Step 1: Parse the Dependency Manifest
- Read package.json, go.mod, Cargo.toml, requirements.txt, pyproject.toml, Pipfile, pom.xml, build.gradle, Gemfile, or equivalent
- Separate production/runtime deps from dev/build deps
- Count totals for each category
- Note the package manager and lockfile status (locked vs floating)

### Step 2: Categorize by Role
Group dependencies into functional categories:
- **Framework** (Express, FastAPI, Rails, Spring, etc.)
- **Database/ORM** (Prisma, TypeORM, SQLAlchemy, GORM, etc.)
- **Auth** (passport, next-auth, devise, etc.)
- **HTTP/API client** (axios, got, requests, etc.)
- **Validation** (zod, joi, pydantic, etc.)
- **Testing** (jest, vitest, pytest, etc.)
- **Build tooling** (webpack, vite, esbuild, etc.)
- **Logging/Observability** (winston, pino, sentry, etc.)
- **Utilities** (lodash, date-fns, etc.)

For each category: identify the primary dep and flag any overlap (e.g., both moment AND date-fns).

### Step 3: Identify the Critical Path (mandatory, even at shallow depth)
Which 5-8 deps are structural — the project cannot function without them?

For each:
- Name and version
- What it does in THIS project (not generic description)
- Where it is primarily used (grep for imports — cite top 2-3 files)
- One-sentence characterization: "stable foundation", "actively evolving", "maintenance mode", "deprecated"

### Step 4: Assess Version Health (deep only)
- Are versions pinned (exact), ranged (^/~), or floating (*)?
- Which deps are 2+ major versions behind current?
- Are any deps officially deprecated or archived?
- Is the lockfile checked in? Is it up to date with the manifest?
- Note any pre-release or beta versions in use

### Step 5: Detect Anomalies (deep only)
- Multiple packages solving the same problem (e.g., both axios and got, both moment and dayjs)
- Vendored or forked dependencies (git:// URLs, file: references)
- Unusually heavy deps for what they do (a 500KB utility for one function)
- Dependencies with known security advisories (if audit info is available from lockfile metadata)
- Dev dependencies that appear in production imports, or vice versa

### Step 6: Produce Upgrade Priority List (deep only)
Rank the top 5 deps that should be upgraded, based on:
- **Security**: known CVE patterns or audit warnings
- **API breakage risk**: upcoming major versions with breaking changes
- **Maintenance health**: last publish date, open issues, bus factor

For each: name, current version, latest version, risk level, and one-line rationale.

## Output Format

```
## Dependencies: [project name]

## Summary
[X] production deps, [Y] dev deps. Package manager: [npm/pip/cargo/etc]. Lockfile: [yes/no].

## Critical Dependencies
| Dep | Version | Role | Used In | Status |
|-----|---------|------|---------|--------|
| ... | ...     | ...  | ...     | ...    |

## By Category
### Framework
- [dep]: [what it does here]
### Database
- [dep]: [what it does here]
### [other categories as applicable]
...

## Anomalies (deep only)
- ...

## Version Health (deep only)
- Pinning strategy: ...
- Behind current: ...
- Deprecated: ...

## Upgrade Priority (deep only)
| Dep | Current | Latest | Risk | Rationale |
|-----|---------|--------|------|-----------|
| ... | ...     | ...    | ...  | ...       |
```

## Rules

- The Critical Dependencies table is mandatory. If you can only produce one section, produce this one.
- For "Used In", cite actual file paths from grep results. Do not guess.
- Do not list every dependency. The point is to highlight what matters and categorize the rest. For large projects (50+ deps), summarize utilities as a group rather than listing each one.
- If you cannot determine the latest version or maintenance status, say "UNKNOWN" — do not fabricate version numbers.
- At shallow depth: produce Summary + Critical Dependencies + By Category only. Skip anomalies, health, and upgrade priority.
- Distinguish between what the dep IS (generic) and what it DOES HERE (specific). "Express is a web framework" is useless. "Express serves the REST API — routes defined in src/routes/" is useful.

## Example Usage

User: "What dependencies does this project use?"

Expected output for a typical Node.js API: Summary shows 23 prod deps, 18 dev deps, npm with lockfile. Critical deps: express (API framework, src/app.ts), prisma (ORM, src/db/), zod (validation, src/schemas/), passport (auth, src/auth/), bull (job queue, src/jobs/). Categories show testing is vitest+supertest, build is TypeScript+tsx, logging is pino+pino-http. Anomalies: both lodash and ramda are installed but only lodash is imported. Upgrade priority: prisma 4->5 has breaking migration changes, passport 0.6->0.7 changes session handling.
