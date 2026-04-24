import { access } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { AgentId } from './adapters/types.js';

const exec = promisify(execFile);

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function whichExists(cmd: string): Promise<boolean> {
  try {
    await exec('which', [cmd]);
    return true;
  } catch {
    return false;
  }
}

interface AgentCheck {
  id: AgentId;
  displayName: string;
  check: () => Promise<boolean>;
}

const agentChecks: AgentCheck[] = [
  {
    id: 'claude',
    displayName: 'Claude Code',
    check: async () =>
      await exists(join(homedir(), '.claude')) || await whichExists('claude'),
  },
  {
    id: 'codex',
    displayName: 'Codex CLI',
    check: async () =>
      await exists(join(homedir(), '.codex')) ||
      await exists(join(homedir(), '.agents')) ||
      await whichExists('codex'),
  },
  {
    id: 'gemini',
    displayName: 'Gemini CLI',
    check: async () =>
      await exists(join(homedir(), '.gemini')) || await whichExists('gemini'),
  },
  {
    id: 'cursor',
    displayName: 'Cursor',
    check: async () =>
      await exists(join(homedir(), '.cursor')) || await whichExists('cursor'),
  },
];

export async function detectAgents(): Promise<AgentId[]> {
  const results = await Promise.all(
    agentChecks.map(async (ac) => ({
      id: ac.id,
      found: await ac.check(),
    }))
  );
  return results.filter(r => r.found).map(r => r.id);
}

export function getAgentDisplayName(id: AgentId): string {
  return agentChecks.find(a => a.id === id)?.displayName ?? id;
}
