export type ArtifactType = 'skill' | 'command' | 'agent' | 'rule';

export type AgentId = 'claude' | 'codex' | 'gemini' | 'cursor';

export interface CatalogItem {
  name: string;
  type: ArtifactType;
  path: string;
  description: string;
  agents: AgentId[];
  tags?: string[];
}

export interface Catalog {
  version: number;
  items: CatalogItem[];
}

export type InstallScope = 'user' | 'project';

export interface InstallResult {
  agent: AgentId;
  targetPath: string;
  success: boolean;
  error?: string;
}

export interface AgentAdapter {
  id: AgentId;
  displayName: string;
  detect(): Promise<boolean>;
  supports(type: ArtifactType): boolean;
  getTargetPath(item: CatalogItem, scope: InstallScope): string;
  install(item: CatalogItem, sourcePath: string, scope: InstallScope): Promise<void>;
  uninstall(item: CatalogItem, scope: InstallScope): Promise<void>;
}
