---
name: api-surface
description: "Inventory everything this project exposes — REST/GraphQL/gRPC endpoints, CLI commands, library exports, event contracts, webhooks. Use when integrating with a project, reviewing API completeness, or onboarding to understand capabilities. Supports depth hints: shallow (endpoint list) or deep (full contract documentation)."
---

# API Surface

Inventory this project's external interface — everything that callers, users, or consumers can interact with. Do NOT describe internal architecture. Focus on what crosses the boundary: every endpoint, command, export, or event that the outside world can touch.

## Input

The user provides one of:
- Nothing — inventory the entire API surface
- A specific area ("what REST endpoints exist?", "what does this library export?", "what events does this emit?")
- A depth hint: `shallow` (endpoint/export list, 2-3 minutes) or `deep` (full contracts with shapes, 10+ minutes)

Default depth is **shallow**.

## Process

### Step 1: Detect Interface Types
Determine what kind of interfaces this project exposes. Check for:
- **REST API**: route definitions (Express app.get/post, FastAPI @app.route, Spring @RequestMapping, Rails routes.rb)
- **GraphQL**: schema files (.graphql), resolvers, type definitions
- **gRPC**: .proto files, service definitions
- **CLI**: command registrations (commander, yargs, click, cobra, clap)
- **Library/SDK**: package exports (package.json exports/main, __init__.py __all__, mod.rs pub)
- **Event/Message producer**: event emitters, queue publishers (Kafka, RabbitMQ, SNS/SQS producers)
- **Webhooks**: outbound HTTP calls triggered by events
- **WebSocket**: real-time endpoints

Report which types are present. Most projects have 1-2.

### Step 2: Inventory All Endpoints/Commands/Exports
For each interface type found, produce a complete list:
- **REST**: method, path, handler file:line, auth required (yes/no/unknown)
- **GraphQL**: query/mutation/subscription name, resolver file, auth
- **gRPC**: service.method, handler file
- **CLI**: command, subcommands, flags/options summary, handler file
- **Library**: exported function/class/type name, module path, brief purpose
- **Events**: event name, payload description, publisher file

Group related items together. Do not omit any — completeness matters here.

### Step 3: Group by Resource or Domain
Organize the inventory into logical groups:
- For REST: by resource (/users/*, /orders/*, /auth/*)
- For CLI: by command group (auth login, auth logout, config set, config get)
- For libraries: by module or namespace
- For events: by domain (user.*, order.*, payment.*)

Count items per group to show distribution.

### Step 4: Identify Critical Paths
Which 3-5 endpoints/commands/exports are the most important?

Heuristics:
- Referenced most in tests
- Most complex handler (lines of code, number of dependencies)
- Named to suggest core operations (create, process, execute vs. healthcheck, version)
- Documented or mentioned in README

For each critical path: name, why it matters, and what file to read to understand it.

### Step 5: Document Request/Response Shapes (deep only)
For the top 5 critical endpoints/commands:
- **Input shape**: parameters, body schema, headers, query params. Use TypeScript interfaces, JSON Schema, protobuf messages, or whatever the project uses.
- **Output shape**: response body, status codes, error format
- **Validation**: what validation is applied to inputs? (zod schemas, joi, class-validator, manual checks)

Cite the actual type definitions or validation schemas found in code.

### Step 6: Find Existing API Documentation (deep only)
- **OpenAPI/Swagger**: check for openapi.yaml, swagger.json, or auto-generation setup
- **GraphQL**: introspection enabled? Schema file up to date?
- **CLI**: --help output, man pages, documentation site
- **Library**: generated docs (typedoc, jsdoc, rustdoc, godoc)

Assess: does documentation exist? Is it auto-generated or manual? Is it likely current? (Compare last doc update to last code change.)

### Step 7: Identify Versioning and Deprecation (deep only)
- Is the API versioned? (path-based /v1/, header-based, content negotiation)
- Are there deprecated endpoints? (marked in code, docs, or route comments)
- Are there experimental/beta endpoints? (feature-flagged, marked unstable)
- Is there a changelog or migration guide for API changes?

## Output Format

```
## API Surface: [project name]

## Interface Types
- [REST API / GraphQL / CLI / Library / Events / etc.]

## Endpoints
### [Group 1: e.g., Users]
| Method | Path | Auth | Handler |
|--------|------|------|---------|
| GET    | /users | yes | src/routes/users.ts:15 |
| POST   | /users | yes | src/routes/users.ts:42 |
| ...    | ...    | ... | ...     |

### [Group 2: e.g., Orders]
| Method | Path | Auth | Handler |
|--------|------|------|---------|
| ...    | ...  | ...  | ...     |

(Adapt table format for CLI commands, library exports, events, etc.)

## Critical Paths
1. `[endpoint/command]` — [why it matters]. Read: `[file path]`
2. ...

## Request/Response Shapes (deep only)
### [Endpoint 1]
**Input:**
```[language]
[type/schema]
```
**Output:**
```[language]
[type/schema]
```

## API Documentation (deep only)
- [exists/missing]. Format: [OpenAPI/manual/etc]. Current: [yes/no/uncertain].

## Versioning (deep only)
- Strategy: [path/header/none]
- Deprecated: [list or none]
```

## Rules

- The Endpoints inventory is mandatory. If you can only produce one section, produce this one. It must be COMPLETE — do not sample or summarize. Every endpoint/command/export must appear.
- For handler locations, use actual file:line references from reading the route/command definitions. Do not guess file paths.
- Auth column should reflect what you can determine from route middleware, decorators, or guards. Use "unknown" if authentication handling is not visible at the route level.
- Adapt the output format to the interface type. A CLI tool needs a command table, not an HTTP method table. A library needs an export table. Do not force REST format on non-REST interfaces.
- At shallow depth: produce Interface Types + Endpoints + Critical Paths. Skip shapes, documentation audit, and versioning.
- If the project has no external interface (pure library with no exports, internal module), say so clearly and describe what it provides to its parent project instead.
- For monorepos or projects with multiple interface types, organize by type first, then by group within each type.

## Example Usage

User: "What endpoints does this API have?"

Expected output for a typical REST API: Interface type is REST API (Express). 24 endpoints grouped into 5 resources: Auth (POST /auth/login, POST /auth/register, POST /auth/refresh, DELETE /auth/logout), Users (GET /users, GET /users/:id, PATCH /users/:id, DELETE /users/:id), Orders (GET /orders, POST /orders, GET /orders/:id, PATCH /orders/:id/status), Products (GET /products, GET /products/:id, POST /products, PUT /products/:id), Webhooks (POST /webhooks/stripe, POST /webhooks/shipment). Critical paths: POST /orders (core business operation, 200-line handler orchestrating inventory check, payment, and fulfillment), POST /auth/login (JWT issuance, rate limited), POST /webhooks/stripe (payment confirmation, idempotency handling). Auth required on all except login/register and product reads.
