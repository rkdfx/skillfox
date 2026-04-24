---
name: explore-guide
description: "Guide for using repo-overview, extract-concepts, and trace-flow together to explore an unfamiliar codebase. Use when you want the recommended workflow, or when you're unsure which skill to start with."
---

# Explore Guide

This is a meta-skill that explains how to use the codebase exploration skills together effectively.

## The Workflow

Use the three exploration skills in this sequence:

### Step 1: repo-overview (WHERE things are)

Start here. Always.

```
/repo-overview
```

This gives you the map: what the project is, how it's structured, where execution starts, and which 5 files to read first. For large repos, this will ask you to pick a subsystem before going deeper.

**You're done when**: You can describe the project's architecture in 2–3 sentences and know which directories matter.

### Step 2: extract-concepts (HOW the team thinks)

Now build your vocabulary.

```
/extract-concepts
```

This extracts the domain terms, abstractions, and mental models embedded in the code. After this, you should be able to read the code without constantly looking up what things mean.

**You're done when**: You can read a random file in the codebase and recognize the domain terms and patterns being used.

### Step 3: trace-flow (WHAT actually happens)

Now see the system in motion. Pick 2–3 critical flows.

```
/trace-flow [specific operation]
```

If you don't know which flows matter, invoke trace-flow without an argument — it will suggest 3 based on the codebase.

**Pick flows that cover different parts of the architecture:**
- The primary happy path (the thing this system does most)
- A write/mutation path (how state changes)
- An async or background path (what happens outside the request cycle)

**You're done when**: You can predict roughly what code will execute for a given user action.

## Depth Strategy

Each skill supports `shallow` and `deep` modes. Recommended approach:

```
First pass:  All three skills at shallow depth (~15 minutes total)
Second pass:  Go deep on the areas you'll actually work in
```

Don't go deep on everything. Shallow understanding of the whole system + deep understanding of your working area is better than medium understanding of everything.

## When to Re-Run

- **repo-overview**: Re-run when you switch to a different subsystem, or quarterly on active repos
- **extract-concepts**: Re-run when you're moving into an unfamiliar module
- **trace-flow**: Re-run whenever you need to understand a specific behavior before making a change

## Anti-Patterns

### Skipping repo-overview
Jumping straight into tracing flows without understanding the architecture leads to local understanding without a global map. You'll know how one endpoint works but not how it fits into the system.

### Accepting vague outputs
If the AI says "the service processes the request," push back. Ask for the specific file, function, and transformation. Vague outputs build false confidence.

### Treating output as ground truth
These skills produce a **starting** mental model. The AI may be wrong about specific details, especially in large or complex codebases. Verify critical paths by reading the actual code before making changes.

### Over-relying on extract-concepts
Domain concepts are useful for understanding, but you still need to trace flows to know how things actually behave at runtime. Concepts tell you the vocabulary; flows tell you the story.

### Tracing too many flows at once
Pick 2–3 critical paths. Breadth of tracing without depth of understanding is worse than deep understanding of fewer flows. You can always trace more later.

### Not re-running after changes
Your mental model decays as the codebase evolves. A repo-overview from three months ago may be misleading if the architecture shifted. Re-run periodically on active repos.

### Going deep too early
Shallow-first, deep-second. Deep analysis of a module you'll never touch is wasted effort. Get the shallow map, identify your working area, then go deep there.
