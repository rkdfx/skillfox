---
name: test-strategy
description: "Map how testing is done — frameworks, patterns, coverage distribution, and a write-your-first-test template. Use when onboarding to a project, before writing your first test, or when evaluating test health. Supports depth hints: shallow (quick map) or deep (full test audit)."
---

# Test Strategy

Map this project's testing landscape. Do NOT just count test files — understand the strategy, patterns, and how to write a test that fits. A developer should finish reading this and be able to write their first passing test.

## Input

The user provides one of:
- Nothing — analyze the full testing landscape
- A specific module or area ("how is auth tested?", "what's the test pattern for API endpoints?")
- A depth hint: `shallow` (quick map, 2-3 minutes) or `deep` (full audit, 10+ minutes)

Default depth is **shallow**.

## Process

### Step 1: Identify Test Infrastructure
- Find test frameworks from config and dependencies: Jest, Vitest, Mocha, pytest, Go testing, JUnit, RSpec, xUnit, etc.
- Find test runner config files: jest.config.*, vitest.config.*, pytest.ini, setup.cfg, conftest.py, .mocharc.*, etc.
- Note any custom test harnesses, assertion libraries (chai, should, assert), or mock frameworks (sinon, testdouble, unittest.mock)
- Check for e2e frameworks: Playwright, Cypress, Selenium, TestCafe
- Report the complete test stack in one line: "[framework] + [assertion lib] + [mock lib] + [e2e]"

### Step 2: Map Test Organization
- Where do tests live? Options: co-located (src/__tests__/, src/*.test.ts), separate tree (test/, tests/, spec/), mirror structure
- What is the naming convention? *.test.ts, *_test.go, *Spec.java, test_*.py, *_spec.rb
- Count test files per top-level directory/module to show distribution
- Identify which modules have zero test files

### Step 3: Classify Test Types
Scan the test files and categorize:
- Unit tests: isolated, mock dependencies, fast
- Integration tests: use real dependencies (database, filesystem, other services)
- E2E tests: full system, browser or API level
- Snapshot tests: UI or serialization snapshots
- Contract tests: API contract verification
- Other: performance, smoke, fuzz, property-based

Report the approximate ratio and which directories correspond to which type.

### Step 4: Identify Test Utilities
Find the project's test helpers — these are critical for writing new tests efficiently:
- Fixtures and factories: data builders, test data files, factory functions
- Mocking utilities: custom mock creators, stub generators, fake implementations
- Setup/teardown helpers: database reset, server bootstrap, auth helpers
- Custom matchers or assertions

List the top 5 most useful utilities with: name/file path, what it does, and a one-line code example of usage.

### Step 5: Assess Coverage Distribution (deep only)
- If a coverage config exists (jest --coverage, pytest-cov, go test -cover), note the configuration
- If a coverage report exists, summarize: overall %, top 3 well-covered modules, top 3 under-covered modules
- If no coverage tooling exists, estimate by comparing test file count to source file count per module
- Flag modules with zero test coverage

### Step 6: Document the Test Workflow
- How to run ALL tests: the exact command
- How to run a SINGLE test file: the exact command with a placeholder
- How to run a SINGLE test case: the exact command if possible
- How to run in watch mode (if available)
- How to generate a coverage report (if available)
- CI-only tests vs local tests: are there tests that only run in CI? Are there different test configs for CI?
- How long do tests take? (estimate from CI config or test count)

### Step 7: Produce a "Write Your First Test" Template
Based on existing test patterns in this project, produce a complete test skeleton that a developer can copy-paste and modify:
- Correct import/require statements for the test framework and assertion library
- The project's setup/teardown pattern (beforeAll, beforeEach, afterEach)
- The project's mock/stub pattern
- The project's assertion style (expect().toBe(), assert.equal(), should)
- A placeholder test case with the correct structure
- Comment where the developer should plug in their own logic

This template should compile/parse without errors if the placeholders are filled in.

## Output Format

```
## Test Strategy: [project name]

## Test Stack
[framework] + [assertion] + [mocks] + [e2e if any]
Config: [config file path]

## Organization
- Location: [co-located / separate tree / mirror]
- Convention: [naming pattern]
- Distribution:
  | Module | Test Files | Source Files | Ratio |
  |--------|-----------|-------------|-------|
  | ...    | ...       | ...         | ...   |

## Test Types
- Unit: [count/ratio] — [where they live]
- Integration: [count/ratio] — [where they live]
- E2E: [count/ratio] — [where they live]

## Key Test Utilities
1. `path/to/helper` — [what it does]
   ```
   usage example
   ```
2. ...

## How to Run Tests
- All: `[command]`
- Single file: `[command] path/to/test`
- Single case: `[command] -t "test name"`
- Watch: `[command]`
- Coverage: `[command]`

## Coverage (deep only)
- Overall: [X]%
- Well-covered: ...
- Under-covered: ...

## Write Your First Test
```[language]
// Copy this template and modify

[complete test skeleton following project patterns]
```
```

## Rules

- The "Write Your First Test" template is mandatory. If you can only produce one section, produce this one. A developer should be able to copy it, fill in placeholders, and have a passing test.
- The test template MUST match this project's actual patterns. Read at least 3 existing test files to extract the common structure. Do not default to generic framework examples.
- Verify every command you suggest. If the project uses `vitest` don't suggest `jest --watch`. Check package.json scripts, Makefile targets, or CI config for the actual test commands.
- Do not count generated test files, snapshot files, or test data files as "test files."
- At shallow depth: produce Test Stack + Organization + Test Types + How to Run + Write Your First Test. Skip coverage and limit test utilities to top 3.
- If the project has no tests at all, say so clearly. Still produce the Test Stack section (noting what framework the project could use based on its language/deps) and a suggested first test.

## Example Usage

User: "How do I write tests for this project?"

Expected output for a typical TypeScript API: Test stack is Vitest + built-in assertions + vi.mock + Supertest for HTTP. Tests are co-located as `*.test.ts` alongside source files. Distribution shows src/routes/ has 12 test files covering all endpoints, src/services/ has 8 test files, src/utils/ has 3, src/middleware/ has 0 (gap). Types: ~80% unit, ~15% integration (use test database), ~5% e2e. Key utilities: createTestUser() in test/helpers/auth.ts, resetDB() in test/helpers/db.ts, mockStripe() in test/helpers/stripe.ts. Run with `npm test`, single file with `npx vitest run src/path.test.ts`, watch with `npx vitest`. Template shows a complete test with proper imports, vi.mock for dependencies, describe/it structure, and expect assertions matching the project style.
