---
name: extract-concepts
description: "Extract the domain concepts, patterns, and mental models embedded in a codebase. Use when you need to understand the vocabulary, abstractions, and design decisions that shape the system — not just what the code does, but how the team thinks about the problem. Supports depth hints: shallow (key terms only) or deep (full concept analysis)."
---

# Extract Concepts

Identify the key domain concepts, design patterns, and abstractions in this codebase. Focus on building a vocabulary and mental model — NOT on implementation details.

## Input

The user provides one of:
- A module or directory to analyze (e.g., "src/claims/", "the billing subsystem")
- A domain area (e.g., "how this system models users and permissions")
- Nothing — in which case, analyze the codebase as a whole
- A depth hint: `shallow` (vocabulary + concept map only) or `deep` (full analysis with patterns and implicit rules)

Default depth is **shallow** unless the user asks for deep.

## Process

### Step 1: Domain Vocabulary
Identify the core domain terms this codebase uses. For each:

```
**Term**: [name as used in code]
  Meaning: What it represents in this system (one line)
  Where: Primary file or module where it's defined
  Relationships: What it connects to
```

Focus on terms that a newcomer would need to learn. Skip generic programming terms (controller, service, repository) unless they carry domain-specific meaning here.

### Step 2: Concept Map
Produce a text-based concept map showing how the top 5–8 concepts relate:

```
[Concept A] --creates--> [Concept B]
[Concept B] --belongs-to--> [Concept C]
[Concept C] --triggers--> [Concept D]
```

This is the most important output. A newcomer should be able to read this map and understand how the system's core ideas connect.

### Step 3: Key Abstractions (deep only)
Identify the major abstractions — interfaces, base classes, type hierarchies, or patterns that shape how the code is organized:

- What is the abstraction?
- What problem does it solve?
- How is it extended or implemented? (list 2–3 concrete examples)

### Step 4: Design Patterns in Use (deep only)
Identify patterns — not textbook names, but how the codebase actually uses them:

```
**Pattern**: [name or description]
  Where: [which module/area]
  Why: [what problem it solves in THIS codebase]
  Example: [one concrete instance]
```

Common patterns to look for: plugin architecture, event-driven, pipeline/chain, visitor, strategy, repository, specification, state machine, CQRS, saga.

### Step 5: Implicit Rules (deep only)
Every codebase has unwritten rules that shape contribution. Identify:

- Ownership boundaries (which team/module owns what, if apparent)
- Extension points (where are you MEANT to add new code?)
- Invariants (what must always be true? what does the code protect?)
- Conventions that aren't documented but are consistent

## Output Format

### Shallow
```
## Domain Vocabulary
| Term | Meaning | Primary Location |
|------|---------|-----------------|
| ...  | ...     | ...             |

## Concept Map
[A] --relation--> [B]
...
```

### Deep
```
## Domain Vocabulary
| Term | Meaning | Primary Location |
|------|---------|-----------------|
| ...  | ...     | ...             |

## Concept Map
[A] --relation--> [B]
...

## Key Abstractions
### [Abstraction Name]
- Purpose: ...
- Implementations: ...

## Design Patterns
### [Pattern Name]
- Where: ...
- Why: ...
- Example: ...

## Implicit Rules
- ...
```

## Rules

- Extract concepts FROM the code, not from external knowledge about the domain.
- If a term is used inconsistently across the codebase, note the inconsistency.
- Say "uncertain" if you're inferring a concept that isn't clearly reflected in the code.
- Limit domain vocabulary to 8–15 terms. More means you're not prioritizing.
- Focus on concepts that would survive a refactor — not implementation artifacts.
- If a pattern name doesn't fit neatly, describe it plainly instead of forcing a GoF label.
- The Concept Map is mandatory even at shallow depth. If you can only produce one section, produce this one.

## Example Usage

User: "Extract the key concepts from the Kubernetes codebase."

Expected output covers: domain terms like Pod, Node, Namespace, Deployment, ReplicaSet, Service, Controller, Informer, Reconciler, Watch; concept map showing Deployment --manages--> ReplicaSet --manages--> Pod, Controller --watches--> Resource --via--> Informer, Service --routes-to--> Pod; at deep depth, abstractions like the controller-runtime reconcile loop, the client-go informer/lister cache pattern, the API machinery type system; patterns like level-triggered reconciliation (desired vs. actual state), admission webhooks as a pipeline, CRD + operator as the extension model; implicit rules like "controllers must be idempotent," "never modify objects from informer cache directly," the split between `staging/` and top-level packages.
