import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import type { AgentAdapter, AgentId, CatalogItem, InstallResult, InstallScope } from './adapters/types.js';
import { claude } from './adapters/claude.js';
import { codex } from './adapters/codex.js';
import { gemini } from './adapters/gemini.js';
import { cursor } from './adapters/cursor.js';

const adapters: Record<AgentId, AgentAdapter> = {
  claude,
  codex,
  gemini,
  cursor,
};

export function getAdapter(id: AgentId): AgentAdapter {
  return adapters[id];
}

export function getAllAdapters(): AgentAdapter[] {
  return Object.values(adapters);
}

async function ensureParentDir(targetPath: string): Promise<void> {
  const parent = join(targetPath, '..');
  await mkdir(parent, { recursive: true });
}

export async function installItem(
  item: CatalogItem,
  sourcePath: string,
  agents: AgentId[],
  scope: InstallScope
): Promise<InstallResult[]> {
  const results: InstallResult[] = [];

  for (const agentId of agents) {
    const adapter = adapters[agentId];
    if (!adapter) {
      results.push({ agent: agentId, targetPath: '', success: false, error: `Unknown agent: ${agentId}` });
      continue;
    }
    if (!item.agents.includes(agentId)) {
      continue;
    }
    if (!adapter.supports(item.type)) {
      continue;
    }

    const targetPath = adapter.getTargetPath(item, scope);
    try {
      await ensureParentDir(targetPath);
      await adapter.install(item, sourcePath, scope);
      results.push({ agent: agentId, targetPath, success: true });
    } catch (err) {
      results.push({
        agent: agentId,
        targetPath,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

export async function uninstallItem(
  item: CatalogItem,
  agents: AgentId[],
  scope: InstallScope
): Promise<InstallResult[]> {
  const results: InstallResult[] = [];

  for (const agentId of agents) {
    const adapter = adapters[agentId];
    if (!adapter || !item.agents.includes(agentId) || !adapter.supports(item.type)) {
      continue;
    }

    const targetPath = adapter.getTargetPath(item, scope);
    try {
      await adapter.uninstall(item, scope);
      results.push({ agent: agentId, targetPath, success: true });
    } catch (err) {
      results.push({
        agent: agentId,
        targetPath,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
