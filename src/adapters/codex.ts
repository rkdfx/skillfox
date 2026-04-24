import { homedir } from 'node:os';
import { join } from 'node:path';
import { cp, rm, access } from 'node:fs/promises';
import type { AgentAdapter, ArtifactType, CatalogItem, InstallScope } from './types.js';

function resolveBase(scope: InstallScope): string {
  return scope === 'user' ? homedir() : process.cwd();
}

export const codex: AgentAdapter = {
  id: 'codex',
  displayName: 'Codex CLI',

  async detect() {
    try {
      await access(join(homedir(), '.codex'));
      return true;
    } catch {
      try {
        await access(join(homedir(), '.agents'));
        return true;
      } catch {
        return false;
      }
    }
  },

  supports(type: ArtifactType) {
    return type === 'skill';
  },

  getTargetPath(item: CatalogItem, scope: InstallScope): string {
    const base = resolveBase(scope);
    return join(base, '.agents', 'skills', item.name);
  },

  async install(item: CatalogItem, sourcePath: string, scope: InstallScope) {
    const target = this.getTargetPath(item, scope);
    await cp(sourcePath, target, { recursive: true });
  },

  async uninstall(item: CatalogItem, scope: InstallScope) {
    const target = this.getTargetPath(item, scope);
    await rm(target, { recursive: true, force: true });
  },
};
