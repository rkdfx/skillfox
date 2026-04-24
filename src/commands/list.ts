import chalk from 'chalk';
import type { AgentId, ArtifactType, CatalogItem } from '../adapters/types.js';
import { loadCatalog, filterItems, getPackageRoot } from '../catalog.js';

function groupByType(items: CatalogItem[]): Map<ArtifactType, CatalogItem[]> {
  const groups = new Map<ArtifactType, CatalogItem[]>();
  for (const item of items) {
    const list = groups.get(item.type) ?? [];
    list.push(item);
    groups.set(item.type, list);
  }
  return groups;
}

const typeLabels: Record<ArtifactType, string> = {
  skill: 'Skills',
  command: 'Commands',
  agent: 'Agents',
  rule: 'Rules',
};

function formatAgents(agents: AgentId[]): string {
  return chalk.dim(`[${agents.join(', ')}]`);
}

export async function listCommand(opts: {
  type?: ArtifactType;
  tag?: string;
  agent?: AgentId;
}): Promise<void> {
  const catalog = await loadCatalog(getPackageRoot());
  const items = filterItems(catalog, opts);

  if (items.length === 0) {
    console.log(chalk.yellow('No items found matching filters.'));
    return;
  }

  const groups = groupByType(items);
  const maxName = Math.max(...items.map(i => i.name.length));

  console.log();
  console.log(chalk.bold('Available items:'));
  console.log();

  for (const [type, typeItems] of groups) {
    console.log(chalk.bold.underline(`  ${typeLabels[type]}`));
    for (const item of typeItems) {
      const name = chalk.green(item.name.padEnd(maxName + 2));
      const desc = item.description.padEnd(50);
      const agents = formatAgents(item.agents);
      console.log(`    ${name} ${desc} ${agents}`);
    }
    console.log();
  }
}
