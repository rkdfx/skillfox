import { homedir } from 'node:os';
import { join } from 'node:path';
import { cp, rm, access } from 'node:fs/promises';
import type { AgentAdapter, ArtifactType, CatalogItem, InstallScope } from './types.js';

const SUPPORTED_TYPES: ArtifactType[] = ['skill', 'command', 'agent', 'rule'];

const pathMap: Record<ArtifactType, { user: string; project: string }> = {
  skill:   { user: '.claude/skills',   project: '.claude/skills' },
  command: { user: '.claude/commands',  project: '.claude/commands' },
  agent:   { user: '.claude/agents',    project: '.claude/agents' },
  rule:    { user: '.claude/rules',     project: '.claude/rules' },
};

function resolveBase(scope: InstallScope): string {
  return scope === 'user' ? homedir() : process.cwd();
}

export const claude: AgentAdapter = {
  id: 'claude',
  displayName: 'Claude Code',

  async detect() {
    try {
      await access(join(homedir(), '.claude'));
      return true;
    } catch {
      return false;
    }
  },

  supports(type: ArtifactType) {
    return SUPPORTED_TYPES.includes(type);
  },

  getTargetPath(item: CatalogItem, scope: InstallScope): string {
    const base = resolveBase(scope);
    const dir = pathMap[item.type][scope];
    if (item.type === 'skill') {
      return join(base, dir, item.name);
    }
    return join(base, dir, `${item.name}.md`);
  },

  async install(item: CatalogItem, sourcePath: string, scope: InstallScope) {
    const target = this.getTargetPath(item, scope);
    if (item.type === 'skill') {
      await cp(sourcePath, target, { recursive: true });
    } else {
      await cp(sourcePath, target);
    }
  },

  async uninstall(item: CatalogItem, scope: InstallScope) {
    const target = this.getTargetPath(item, scope);
    await rm(target, { recursive: true, force: true });
  },
};
