---
name: trace-flow
description: "Trace a specific feature, request, or operation through the codebase end-to-end. Use when you need to understand how a particular flow works — an API endpoint, a CLI command, a user action, a background job, or a data pipeline. Supports depth hints: shallow (high-level steps) or deep (every function call)."
---

# Trace Flow

Trace a specific operation through this codebase from trigger to completion. Do NOT summarize — walk through the actual code path step by step.

## Input

The user provides one of:
- A feature or operation name (e.g., "user login", "build task execution", "file upload")
- An entry point (e.g., "POST /api/claims", "handleSubmit in ClaimForm.tsx")
- A question (e.g., "What happens when a policy is renewed?")
- **Nothing** — in which case, suggest 3 critical flows to trace (see Step 0)
- A depth hint: `shallow` (5–7 high-level steps) or `deep` (every function call, 10–15 steps)

Default depth is **shallow** unless the user asks for deep.

If the input is ambiguous, ask one clarifying question before proceeding.

## Process

### Step 0: Suggest Flows (when no input given)
If the user doesn't specify a flow, suggest 3 critical ones based on what you know about the codebase:

```
Suggested flows to trace:
1. [flow name] — [why it's important: it's the main happy path / most common operation / etc.]
2. [flow name] — [why it's important]
3. [flow name] — [why it's important]

Which one? (or describe your own)
```

Pick flows that cover different parts of the architecture. Prefer the primary happy path, a write/mutation path, and an async/background path.

### Step 1: Identify the Trigger
- What initiates this flow? (HTTP request, CLI command, event, scheduler, user action)
- Which file and function is the entry point?

### Step 2: Trace the Path
Walk through the execution path in order. For each step:

```
[Step N] → file_path:function_name
  What: What this step does (one line)
  Key logic: The important decision or transformation happening here
  Calls: What it invokes next
```

Follow the actual code — not what you think it should do. Include:
- Middleware, interceptors, or decorators in the path
- Branching points (conditionals that change the flow)
- Async boundaries (queues, events, callbacks, awaits)

**Shallow depth**: Cover 5–7 high-level steps. Group related operations (e.g., "validation middleware chain" instead of each validator).
**Deep depth**: Follow every function call, 10–15 steps. Include internal helper calls.

### Step 3: Identify the Data Shape
- What data enters the flow? (input type/shape)
- How does it get transformed at each major step?
- What data exits? (response, side effect, stored state)

### Step 4: Mark Boundaries
- Where does the flow cross module boundaries?
- Where does it hit external systems? (DB queries, API calls, file I/O)
- Where are the error/failure paths?

### Step 5: Summarize
Produce a one-paragraph narrative: "When [trigger], [system] does [A], then [B], then [C], resulting in [outcome]."

## Output Format

```
## Flow: [name]
Trigger: [what initiates it]
Depth: [shallow/deep]

### Trace
[Step 1] → src/routes/claims.ts:createClaim
  What: Validates incoming claim payload
  Key logic: Checks policy is active and coverage applies
  Calls: ClaimService.create()

[Step 2] → src/services/ClaimService.ts:create
  What: Persists the claim and triggers notifications
  Key logic: Assigns claim number, sets initial status
  Calls: ClaimRepository.save(), EventBus.emit('claim.created')

...

### Data Shape
- Input: { policyId, lossDate, description, claimantInfo }
- Transforms: validated → enriched with policy data → persisted entity
- Output: { claimId, claimNumber, status: 'open' }

### Boundaries
- Module crossings: routes → services → repositories
- External: PostgreSQL (write), Kafka (event emit), Email service (notification)
- Failure paths: invalid policy → 400, duplicate claim → 409, DB failure → 500

### Summary
When a POST request hits /api/claims, the route handler validates the payload
against the policy, the ClaimService creates a new claim entity with an assigned
number, persists it via the repository, and emits a claim.created event that
triggers downstream notifications.
```

## Rules

- Follow the ACTUAL code path. Do not invent steps that aren't in the code.
- Say "uncertain — could not locate this step in the code" if the trail goes cold.
- Include file paths and function names for every step so the user can navigate there.
- Do not skip middleware, decorators, or interceptors — these often contain critical logic.
- If the flow branches significantly, trace the primary/happy path first, then list branch points.
- At shallow depth, stop at 5–7 steps. At deep depth, stop at 10–15. Offer to go deeper on any step.
- When suggesting flows (Step 0), pick ones that exercise different parts of the architecture.

## Example Usage

User: "Trace what happens when I call setState in React."

Expected output traces: `setState` in `ReactFiberHooks.js` enqueues an update → `scheduleUpdateOnFiber` marks the fiber as needing work → `ensureRootIsScheduled` schedules via Scheduler → `workLoopSync`/`workLoopConcurrent` processes the fiber tree → `beginWork` reconciles the component → `completeWork` builds the DOM mutations → `commitRoot` applies mutations to the real DOM. Data shape shows the update object flowing through the fiber tree to a list of DOM mutations.
