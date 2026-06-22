import { Annotation } from '@langchain/langgraph';
import type { RunDeliveryMode } from './enums.js';
import type { PipelineOutputs } from './node-output.js';
import { ZERO_COST, mergeCost, type CostBundle } from './cost.js';

/**
 * Minimal, host-supplied context for a run. Replaces Mate-X's `SessionData`
 * (Flow OAuth + company). All fields are optional; multi-tenancy (companyId,
 * scope) is intentionally absent from core. A host that needs per-user MCP
 * tokens supplies `getOAuthToken`.
 */
export interface RunContext {
  /** Opaque audit id. No FK, no tenancy semantics in core. */
  userId?: string;
  /** Opaque tenant id for hosts that implement multi-tenant adapters. */
  tenantId?: string;
  /** Resolve a pre-obtained OAuth token for an MCP provider, if the host has one. */
  getOAuthToken?(service: string): Promise<string | undefined> | string | undefined;
}

export interface PipelineMeta {
  runId: string;
  pipelineId: string;
  /** User-facing pipeline name — exposed to the resolver LLM for whole-pipeline context. */
  pipelineName: string;
  /** User-authored pipeline description, or "". */
  pipelineDescription: string;
  deliveryMode: RunDeliveryMode;
  context?: RunContext;
  /**
   * Per-run MCP catalog cache. The runtime loads it once at run start (only if
   * the graph has MCP nodes) and flows it through the state so the LRU compile
   * cache never holds a stale closure. Typed as `unknown[]` so core stays free
   * of MCP adapter types; the MCP package casts it.
   */
  mcpCatalogCache?: readonly unknown[];
}

// ── Node meta ────────────────────────────────────────────────────────────────

export type NodeExecutionStatus = 'RUNNING' | 'SUCCESS' | 'FAILED' | 'ABORTED';

export interface NodeMeta {
  status: NodeExecutionStatus;
  startedAt: string;
  finishedAt?: string;
  error?: PipelineError;
}

export type NodeMetaMap = Record<string, NodeMeta>;

// ── Events ────────────────────────────────────────────────────────────────────

export type NodeEventKind =
  | 'NODE_START'
  | 'NODE_OUTPUT'
  | 'NODE_END'
  | 'NODE_FAILED'
  | 'RESOLVER_START'
  | 'RESOLVER_END'
  | 'LLM_CHUNK';

export interface NodeEvent {
  nodeId: string;
  eventKind: NodeEventKind;
  timestamp: string;
  payload: unknown;
}

// ── Error ─────────────────────────────────────────────────────────────────────

export type PipelineErrorKind =
  | 'VALIDATION'
  | 'NODE_EXECUTION'
  | 'RESOLVER'
  | 'COMPILE'
  | 'RUNTIME'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'COST_CAP';

export interface PipelineError {
  kind: PipelineErrorKind;
  code: string;
  message: string;
  nodeId?: string;
  stack?: string;
}

// ── LangGraph annotation ───────────────────────────────────────────────────────

// `any` keeps LangGraph's internal generics off the public .d.ts surface, which
// avoids cross-package portability warnings — same rationale as the original.
export const PipelineStateAnnotation: any = Annotation.Root({
  meta: Annotation<PipelineMeta>(),

  outputs: Annotation<PipelineOutputs>({
    value: (existing, updates) => ({ ...(existing ?? {}), ...(updates ?? {}) }),
    default: () => ({}),
  }),

  nodeMeta: Annotation<NodeMetaMap>({
    value: (existing, updates) => ({ ...(existing ?? {}), ...(updates ?? {}) }),
    default: () => ({}),
  }),

  cost: Annotation<CostBundle>({
    value: (existing, updates) => mergeCost(existing, updates),
    default: () => ZERO_COST,
  }),

  events: Annotation<NodeEvent[]>({
    value: (existing, updates) => [...(existing ?? []), ...(updates ?? [])],
    default: () => [],
  }),
});

export type PipelineStateType = typeof PipelineStateAnnotation.State;
