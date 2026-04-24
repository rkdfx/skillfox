# skillfox

Simple CLI to install AI coding agent skills, commands, and agents across multiple tools.

Supports **Claude Code**, **Codex CLI**, **Gemini CLI**, and **Cursor**.

## Usage

```bash
# List available items
npx @rkdfx/skillfox list
npx @rkdfx/skillfox list --type skill
npx @rkdfx/skillfox list --tag git

# Install a skill to all detected agents
npx @rkdfx/skillfox install commit-message

# Install to a specific agent
npx @rkdfx/skillfox install commit-message --agent claude

# Install everything
npx @rkdfx/skillfox install --all

# Install to project scope instead of user scope
npx @rkdfx/skillfox install commit-message --scope project

# Uninstall
npx @rkdfx/skillfox uninstall commit-message
```

## How It Works

skillfox auto-detects which AI coding agents you have installed and copies skills to the right paths:

| Agent | Skills Path | Also Supports |
|-------|-------------|---------------|
| Claude Code | `~/.claude/skills/` | commands, agents, rules |
| Codex CLI | `~/.agents/skills/` | — |
| Gemini CLI | `~/.gemini/extensions/skillfox/skills/` | — |
| Cursor | `~/.cursor/skills/` | rules |

Skills follow the [Agent Skills](https://agentskills.io) open standard (`SKILL.md`), so they work across all agents. Commands, agents, and rules are agent-specific.

## Available Items

| Name | Type | Agents | Description |
|------|------|--------|-------------|
| hello-world | skill | all | Sample greeting skill |
| commit-message | skill | all | Generate conventional commit messages from staged changes |

## Adding New Content

### Add a skill

1. Create `content/skills/<name>/SKILL.md`:
   ```yaml
   ---
   name: my-skill
   description: "What it does and when to use it."
   ---

   Instructions for the AI agent...
   ```

2. Add an entry to `catalog.yaml`:
   ```yaml
   - name: my-skill
     type: skill
     path: content/skills/my-skill
     description: "Short description"
     agents: [claude, codex, gemini, cursor]
     tags: [relevant-tag]
   ```

### Add a Claude Code command

1. Create `content/commands/<name>.md` with YAML frontmatter
2. Add to `catalog.yaml` with `type: command` and `agents: [claude]`

### Add a Claude Code agent

1. Create `content/agents/<name>.md` with YAML frontmatter
2. Add to `catalog.yaml` with `type: agent` and `agents: [claude]`

## Development

```bash
npm install
npm run build
node bin/skillfox.mjs list
```

## License

MIT
