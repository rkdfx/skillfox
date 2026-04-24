---
name: commit-message
description: "Generate conventional commit messages from staged changes. Use when the user asks to write a commit message or says 'commit'."
---

# Commit Message Generator

Analyze the staged git changes and generate a commit message following Conventional Commits format.

## Process

1. Run `git diff --cached --stat` to see what files changed
2. Run `git diff --cached` to see the actual changes
3. Generate a commit message with:
   - **Type**: feat, fix, refactor, docs, test, chore, ci, style, perf, build
   - **Scope**: optional, the area of change (e.g., auth, api, ui)
   - **Subject**: imperative mood, lowercase, no period, max 50 chars
   - **Body**: only if the "why" isn't obvious from the subject

## Format

```
type(scope): subject

Optional body explaining WHY, not WHAT.
```

## Rules

- Read the diff carefully — don't guess
- Pick the most specific type that fits
- If multiple changes span different concerns, suggest splitting the commit
- Never include file paths in the subject line
- Body wraps at 72 characters
