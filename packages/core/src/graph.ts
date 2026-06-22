import type { NodeType } from './enums.js';
import type { NodeInputs } from './value-binding.js';
import type { NodeSpec } from './node-spec.js';

// Plain graph interfaces replacing the Mate-X Prisma row types. No FK columns,
// no multi-tenancy (creatorId / companyId / scope / purpose are NOT here).

export interface WorkflowRow {
  id: string;
  name: string;
  description?: string;
  outputJsonSchema?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowNodeRow {
  id: string;
  workflowId: string;
  nodeType: NodeType;
  /** e.g. `tool.uppercase`, `control.if`, `mcp:notion:query_database`. */
  key: string;
  label: string;
  /** Map of slot name -> ValueBinding. Serialized as JSON in a store. */
  inputs: NodeInputs;
  positionX?: number;
  positionY?: number;
}

export interface WorkflowEdgeRow {
  id: string;
  workflowId: string;
  fromNodeId: string;
  toNodeId: string;
  /** `"true"` / `"false"` for IF-node branches; otherwise undefined/null. */
  label?: string | null;
}

export interface WorkflowWithGraph {
  workflow: WorkflowRow;
  nodes: readonly WorkflowNodeRow[];
  edges: readonly WorkflowEdgeRow[];
}

// ── Compiled forms ──────────────────────────────────────────────────────────────

export interface CompiledNode {
  node: WorkflowNodeRow;
  spec: NodeSpec;
  predecessors: readonly string[];
  successors: readonly string[];
}

export interface TopologyAnalysis {
  entryNodes: readonly WorkflowNodeRow[];
  exitNodes: readonly WorkflowNodeRow[];
  predecessorsByNode: ReadonlyMap<string, readonly string[]>;
  successorsByNode: ReadonlyMap<string, readonly string[]>;
}
