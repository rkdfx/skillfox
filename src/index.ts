import { Command } from 'commander';
import type { AgentId, ArtifactType } from './adapters/types.js';
import { listCommand } from './commands/list.js';
import { installCommand } from './commands/install.js';
import { uninstallCommand } from './commands/uninstall.js';

const program = new Command();

program
  .name('skillfox')
  .description('Install AI coding agent skills, commands, and agents')
  .version('0.1.0');

program
  .command('list')
  .description('List available items in the catalog')
  .option('--type <type>', 'Filter by type (skill, command, agent, rule)')
  .option('--tag <tag>', 'Filter by tag')
  .option('--agent <agent>', 'Filter by agent compatibility')
  .action(async (opts) => {
    await listCommand({
      type: opts.type as ArtifactType | undefined,
      tag: opts.tag,
      agent: opts.agent as AgentId | undefined,
    });
  });

program
  .command('install [name]')
  .description('Install an item to detected agents')
  .option('--agent <agent>', 'Target a specific agent')
  .option('--scope <scope>', 'Install scope: user or project', 'user')
  .option('--all', 'Install everything')
  .option('--tag <tag>', 'Install all items with a given tag')
  .action(async (name, opts) => {
    await installCommand(name, {
      agent: opts.agent as AgentId | undefined,
      scope: opts.scope,
      all: opts.all,
      tag: opts.tag,
    });
  });

program
  .command('uninstall <name>')
  .description('Remove an installed item')
  .option('--agent <agent>', 'Target a specific agent')
  .option('--scope <scope>', 'Install scope: user or project', 'user')
  .action(async (name, opts) => {
    await uninstallCommand(name, {
      agent: opts.agent as AgentId | undefined,
      scope: opts.scope,
    });
  });

program.parse();
