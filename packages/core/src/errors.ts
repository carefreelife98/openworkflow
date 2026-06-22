import type { WorkflowError } from './state.js';

/** Thrown by the compiler when a graph fails validation or a compile invariant. */
export interface CompileErrorEntry {
  scope: 'graph' | 'node';
  kind: string;
  message: string;
  nodeId?: string;
  nodeKey?: string;
}

export class WorkflowCompileError extends Error {
  override readonly name = 'WorkflowCompileError';
  constructor(
    readonly entries: CompileErrorEntry[],
    readonly workflowName: string,
  ) {
    super(`Workflow "${workflowName}" failed to compile: ${entries.map((e) => e.kind).join(', ')}`);
  }
}

/** Thrown when a run is aborted via its AbortSignal. */
export class WorkflowAbortedError extends Error {
  override readonly name = 'WorkflowAbortedError';
  constructor() {
    super('Workflow run aborted');
  }
}

/** Wraps a node-handler failure with the originating node id. */
export class WorkflowNodeExecutionError extends Error {
  override readonly name = 'WorkflowNodeExecutionError';
  constructor(
    readonly nodeId: string,
    readonly workflowError: WorkflowError,
  ) {
    super(workflowError.message);
  }
}

/** Thrown when a run cannot start because of a conflicting state (replaces NestJS ConflictException). */
export class WorkflowConflictError extends Error {
  override readonly name = 'WorkflowConflictError';
}
