import { homedir } from 'node:os';
import { join } from 'node:path';
import { cp, rm, access } from 'node:fs/promises';
import type { AgentAdapter, ArtifactType, CatalogItem, InstallScope } from './types.js';

export const gemini: AgentAdapter = {
  id: 'gemini',
  displayName: 'Gemini CLI',

  async detect() {
    try {
      await access(join(homedir(), '.gemini'));
      return true;
    } catch {
      return false;
    }
  },

  supports(type: ArtifactType) {
    return type === 'skill';
  },

  getTargetPath(item: CatalogItem, scope: InstallScope): string {
    if (scope === 'user') {
      return join(homedir(), '.gemini', 'extensions', 'skillfox', 'skills', item.name);
    }
    return join(process.cwd(), '.gemini', 'extensions', 'skillfox', 'skills', item.name);
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
