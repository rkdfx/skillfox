import { homedir } from 'node:os';
import { join } from 'node:path';
import { cp, rm, access } from 'node:fs/promises';
import type { AgentAdapter, ArtifactType, CatalogItem, InstallScope } from './types.js';

function resolveBase(scope: InstallScope): string {
  return scope === 'user' ? homedir() : process.cwd();
}

export const cursor: AgentAdapter = {
  id: 'cursor',
  displayName: 'Cursor',

  async detect() {
    try {
      await access(join(homedir(), '.cursor'));
      return true;
    } catch {
      return false;
    }
  },

  supports(type: ArtifactType) {
    return type === 'skill' || type === 'rule';
  },

  getTargetPath(item: CatalogItem, scope: InstallScope): string {
    const base = resolveBase(scope);
    if (item.type === 'skill') {
      return join(base, '.cursor', 'skills', item.name);
    }
    return join(base, '.cursor', 'rules', `${item.name}.mdc`);
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
