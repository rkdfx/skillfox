---
name: dev-setup
description: "Identify everything needed to build, run, and develop locally — env vars, services, bootstrap steps, dev tooling. Use when first cloning a repo, onboarding to a new project, or troubleshooting a broken local setup. Supports depth hints: shallow (quick checklist) or deep (full environment audit)."
---

# Dev Setup

Produce a verified checklist for getting this project running locally. Do NOT regurgitate the README — verify what actually exists in the repo and flag gaps.

## Input

The user provides one of:
- Nothing — analyze the full project setup
- A specific concern ("I can't get the database running", "what env vars do I need")
- A depth hint: `shallow` (quick checklist, 2–3 minutes) or `deep` (full audit, 10+ minutes)

Default depth is **shallow** unless the user asks for deep.

## Process

### Step 0: Detect the Runtime Stack
- Scan for package managers and lockfiles: package.json/package-lock.json/yarn.lock/pnpm-lock.yaml, go.mod/go.sum, Cargo.toml/Cargo.lock, requirements.txt/pyproject.toml/Pipfile, Gemfile/Gemfile.lock, pom.xml/build.gradle
- Find version pinning files: .nvmrc, .node-version, .tool-versions, .python-version, rust-toolchain.toml, .java-version, .ruby-version
- Report exact versions required. If no version file exists, note the implicit requirement from the lockfile or framework constraints.

### Step 1: Inventory Environment Configuration
- Find .env.example, .env.sample, .env.template, .env.development, docker-compose.yml, Makefile, and config files
- For each env var found: name, purpose (inferred from code usage), whether it has a default value, and whether it looks like a secret (passwords, keys, tokens)
- Cross-check: grep for env var references in source code that are NOT in any template file. Flag these as "undocumented env vars."
- At shallow depth: list env vars with purpose. At deep depth: trace each var to where it is used in code.

### Step 2: Identify Local Service Dependencies
- Check docker-compose.yml, README setup sections, connection strings in config, and database migration directories
- For each service: name, what it is for in this project, how to start it (docker-compose, brew, manual), and which config/env var points to it
- At shallow depth: list services. At deep depth: verify ports, check for seed data scripts, note health check endpoints.

### Step 3: Map the Bootstrap Sequence
- Determine the correct order: install deps → generate/build artifacts → run migrations → seed data → start dev server
- If a bootstrap script exists (make dev, ./scripts/setup.sh, npm run setup), validate it covers all steps
- If no script exists, produce the exact commands in order
- Note any steps that require manual intervention (creating accounts, obtaining API keys, etc.)

### Step 4: Identify Dev Tooling
- Linters and formatters: eslint, prettier, black, gofmt, rustfmt — note config files
- Pre-commit hooks: husky, lint-staged, lefthook, pre-commit (Python) — what do they run?
- Code generators: codegen, protobuf compilation, schema generation
- IDE config: .vscode/, .idea/, .editorconfig — relevant settings
- At shallow depth: list tools. At deep depth: note exact commands each tool runs.

### Step 5: Flag Setup Pain Points (deep only)
- Missing or outdated setup docs (README says "run X" but X doesn't exist)
- Env vars referenced in code but missing from all template/example files
- Services required but not in docker-compose
- Platform-specific issues (macOS vs Linux vs Windows differences)
- Version conflicts or deprecated tooling

### Step 6: Produce the First-Run Checklist
- Combine all findings into a single numbered checklist
- Each item: the exact command(s) to run, and what it accomplishes
- Mark items that are one-time setup vs. every-time-you-pull
- If a bootstrap script exists and is complete, just reference it with the invocation command

## Output Format

```
## Dev Setup: [project name]

## Prerequisites
| Tool | Version | Install |
|------|---------|---------|
| ...  | ...     | ...     |

## Environment Variables
| Variable | Purpose | Default | Secret |
|----------|---------|---------|--------|
| ...      | ...     | yes/no  | yes/no |

Undocumented (found in code, not in templates):
- ...

## Local Services
| Service | Purpose | Start Command | Config |
|---------|---------|---------------|--------|
| ...     | ...     | ...           | ...    |

## First-Run Checklist
1. ...
2. ...
3. ...

## Dev Tooling
- Linter: ...
- Formatter: ...
- Hooks: ...
- IDE: ...

## Pain Points (deep only)
- ...
```

## Rules

- Verify every command you suggest exists in the repo. Do not recommend `npm run dev` if there is no `dev` script in package.json.
- If you cannot determine something, say "NOT FOUND" rather than guessing. A wrong setup instruction is worse than a missing one.
- Distinguish between "first-time setup" steps and "every-time" steps.
- Do not reproduce the README. Cross-reference it — flag where it is accurate, outdated, or incomplete.
- The First-Run Checklist is mandatory. If you can only produce one section, produce this one.
- If the project has no setup complexity (single file, no deps, no config), say so in one line and stop.

## Example Usage

User: "I just cloned a Node.js project. Help me set it up."

Expected output covers: Node 20 required (from .nvmrc), 15 env vars found in .env.example (3 are secrets: DATABASE_URL, STRIPE_KEY, JWT_SECRET), local services: PostgreSQL 15 on port 5432, Redis on 6379 (both via docker-compose). First-Run: 1) nvm use, 2) npm install, 3) docker-compose up -d, 4) cp .env.example .env, 5) fill in secrets, 6) npx prisma migrate dev, 7) npm run seed, 8) npm run dev. Dev tooling: ESLint + Prettier via husky pre-commit. Pain points: README says "run ./setup.sh" but that script doesn't exist.
