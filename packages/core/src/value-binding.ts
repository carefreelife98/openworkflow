import { z } from 'zod';

/**
 * A node input slot is bound one of three ways:
 * - literal: a constant typed by the author
 * - state: a reference into the run state (e.g. `outputs.<nodeId>.field`)
 * - auto: left for the LLM resolver to fill at runtime
 */
export interface LiteralValueBinding {
  kind: 'literal';
  value: unknown;
}

export interface StateValueBinding {
  kind: 'state';
  /** Must pass {@link validateStatePath}. */
  path: string;
}

export interface AutoValueBinding {
  kind: 'auto';
}

export type ValueBinding = LiteralValueBinding | StateValueBinding | AutoValueBinding;

export const LiteralValueBindingSchema = z.object({
  kind: z.literal('literal'),
  value: z.unknown(),
});

export const StateValueBindingSchema = z.object({
  kind: z.literal('state'),
  path: z.string().min(1).max(256),
});

export const AutoValueBindingSchema = z.object({
  kind: z.literal('auto'),
});

export const ValueBindingSchema = z.discriminatedUnion('kind', [
  LiteralValueBindingSchema,
  StateValueBindingSchema,
  AutoValueBindingSchema,
]);

/** Map of input slot name -> binding for a single node. */
export type NodeInputs = Record<string, ValueBinding>;

export const NodeInputsSchema = z.record(z.string(), ValueBindingSchema);
