// Engine-essential enums only. Mate-X multi-tenancy enums (scope, purpose,
// category, trigger-source) are intentionally NOT part of OpenWorkflow core —
// those are a host concern, implemented in a WorkflowStore adapter if needed.

/**
 * The kind of a node in a workflow graph.
 * - TOOL: a deterministic tool call (built-in or user-defined plugin)
 * - LLM: a direct language-model invocation
 * - IF: a boolean branch (exactly two outgoing edges: "true" / "false")
 * - MCP_TOOL: a tool resolved at compile time from an MCP catalog
 *   (key convention: `mcp:<provider>:<tool>`)
 */
export const NODE_TYPE = {
  TOOL: 'TOOL',
  LLM: 'LLM',
  IF: 'IF',
  MCP_TOOL: 'MCP_TOOL',
} as const;
export type NodeType = (typeof NODE_TYPE)[keyof typeof NODE_TYPE];

/**
 * How a run delivers results.
 * - STREAM: results are streamed to the caller (e.g. via SSE)
 * - INVOKE: fire-and-forget; the caller does not stream results
 */
export const RUN_DELIVERY_MODE = {
  STREAM: 'STREAM',
  INVOKE: 'INVOKE',
} as const;
export type RunDeliveryMode = (typeof RUN_DELIVERY_MODE)[keyof typeof RUN_DELIVERY_MODE];

export const RUN_STATUS = {
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED',
} as const;
export type RunStatus = (typeof RUN_STATUS)[keyof typeof RUN_STATUS];

export const RUN_STEP_STATUS = {
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED',
} as const;
export type RunStepStatus = (typeof RUN_STEP_STATUS)[keyof typeof RUN_STEP_STATUS];
