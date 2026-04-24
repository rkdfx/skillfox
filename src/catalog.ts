import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import type { AgentId, ArtifactType, Catalog, CatalogItem } from './adapters/types.js';

export async function loadCatalog(packageRoot: string): Promise<Catalog> {
  const catalogPath = join(packageRoot, 'catalog.yaml');
  const raw = await readFile(catalogPath, 'utf-8');
  const parsed = parse(raw) as Catalog;

  if (!parsed.version || !Array.isArray(parsed.items)) {
    throw new Error(`Invalid catalog.yaml: missing version or items`);
  }

  return parsed;
}

export function filterItems(
  catalog: Catalog,
  opts: {
    type?: ArtifactType;
    tag?: string;
    agent?: AgentId;
    name?: string;
  }
): CatalogItem[] {
  let items = catalog.items;

  if (opts.name) {
    items = items.filter(i => i.name === opts.name);
  }
  if (opts.type) {
    items = items.filter(i => i.type === opts.type);
  }
  if (opts.tag) {
    items = items.filter(i => i.tags?.includes(opts.tag!));
  }
  if (opts.agent) {
    items = items.filter(i => i.agents.includes(opts.agent!));
  }

  return items;
}

export function getPackageRoot(): string {
  return join(import.meta.dirname, '..', '..');
}
