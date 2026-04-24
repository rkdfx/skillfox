import chalk from 'chalk';
import type { AgentId, InstallScope } from '../adapters/types.js';
import { loadCatalog, filterItems, getPackageRoot } from '../catalog.js';
import { detectAgents, getAgentDisplayName } from '../detect.js';
import { uninstallItem } from '../installer.js';

export async function uninstallCommand(
  name: string,
  opts: {
    agent?: AgentId;
    scope: InstallScope;
  }
): Promise<void> {
  const catalog = await loadCatalog(getPackageRoot());
  const items = filterItems(catalog, { name });

  if (items.length === 0) {
    console.error(chalk.red(`Item not found: ${name}`));
    process.exit(1);
  }

  let agents: AgentId[];
  if (opts.agent) {
    agents = [opts.agent];
  } else {
    agents = await detectAgents();
  }

  console.log();

  let totalRemoved = 0;

  for (const item of items) {
    console.log(`Uninstalling ${chalk.bold(item.name)} (${item.type})...`);

    const results = await uninstallItem(item, agents, opts.scope);

    for (const r of results) {
      if (r.success) {
        console.log(chalk.green(`  ✓ ${getAgentDisplayName(r.agent)} → removed ${r.targetPath}`));
        totalRemoved++;
      } else {
        console.log(chalk.red(`  ✗ ${getAgentDisplayName(r.agent)}: ${r.error}`));
      }
    }
  }

  console.log();
  if (totalRemoved > 0) {
    console.log(chalk.green(`Done. Removed ${totalRemoved} item(s).`));
  } else {
    console.log(chalk.yellow('Nothing was removed.'));
  }
}
