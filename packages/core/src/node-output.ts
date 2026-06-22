// Node outputs. Unlike the Mate-X original (a closed discriminated union of
// Flow-specific tool results), OpenWorkflow core keeps this open: every output
// is an object with a `kind` discriminator and arbitrary fields. Built-in node
// outputs (IF, LLM, generic MCP) are named below; user-defined nodes contribute
// their own `kind` values.

/** The minimal shape every node output must satisfy. */
export interface WorkflowNodeOutput {
  kind: string;
  [key: string]: unknown;
}

// ── Built-in node outputs ───────────────────────────────────────────────────

export interface IfNodeOutput extends WorkflowNodeOutput {
  kind: 'control.if';
  branch: 'true' | 'false';
}

export type LlmFinishReason = 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'unknown';

export interface LlmTokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface LlmNodeOutput extends WorkflowNodeOutput {
  kind: 'llm.invoke';
  text: string;
  finishReason: LlmFinishReason;
  tokenUsage: LlmTokenUsage;
}

/**
 * Output of an MCP tool that has no declared `outputSchema`. The raw tool
 * result is exposed as `output`; downstream `auto` slots can absorb it via the
 * LLM resolver. MCP tools that DO declare an output schema are validated to
 * their exact shape instead.
 */
export interface McpToolNodeOutput extends WorkflowNodeOutput {
  kind: 'mcp_tool';
  providerKey: string;
  toolName: string;
  output: unknown;
}

/** Outputs keyed by node id, as accumulated in the run state. */
export type WorkflowOutputs = Record<string, WorkflowNodeOutput>;
