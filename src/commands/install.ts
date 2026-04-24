import { join } from 'node:path';
import chalk from 'chalk';
import type { AgentId, InstallScope } from '../adapters/types.js';
import { loadCatalog, filterItems, getPackageRoot } from '../catalog.js';
import { detectAgents, getAgentDisplayName } from '../detect.js';
import { installItem } from '../installer.js';

export async function installCommand(
  name: string | undefined,
  opts: {
    agent?: AgentId;
    scope: InstallScope;
    all?: boolean;
    tag?: string;
  }
): Promise<void> {
  if (!name && !opts.all && !opts.tag) {
    console.error(chalk.red('Specify an item name, --all, or --tag'));
    process.exit(1);
  }

  const packageRoot = getPackageRoot();
  const catalog = await loadCatalog(packageRoot);

  let items = opts.all
    ? catalog.items
    : filterItems(catalog, { name, tag: opts.tag });

  if (items.length === 0) {
    console.error(chalk.red(name ? `Item not found: ${name}` : 'No items match filters'));
    process.exit(1);
  }

  let agents: AgentId[];
  if (opts.agent) {
    agents = [opts.agent];
  } else {
    agents = await detectAgents();
    if (agents.length === 0) {
      console.error(chalk.red('No AI coding agents detected. Use --agent to specify one.'));
      process.exit(1);
    }
  }

  console.log();
  console.log(chalk.dim(`Detected agents: ${agents.map(getAgentDisplayName).join(', ')}`));
  console.log();

  let totalInstalled = 0;

  for (const item of items) {
    const sourcePath = join(packageRoot, item.path);
    console.log(`Installing ${chalk.bold(item.name)} (${item.type})...`);

    const results = await installItem(item, sourcePath, agents, opts.scope);

    for (const r of results) {
      if (r.success) {
        console.log(chalk.green(`  ✓ ${getAgentDisplayName(r.agent)} → ${r.targetPath}`));
        totalInstalled++;
      } else {
        console.log(chalk.red(`  ✗ ${getAgentDisplayName(r.agent)}: ${r.error}`));
      }
    }
  }

  console.log();
  if (totalInstalled > 0) {
    console.log(chalk.green(`Done. Installed ${totalInstalled} item(s).`));
  } else {
    console.log(chalk.yellow('Nothing was installed. Check agent compatibility.'));
  }
}
