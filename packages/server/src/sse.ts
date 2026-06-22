import type { PipelineEvent } from '@openpipeline/core';

/** Format a single SSE frame: `event: <kind>\ndata: <json>\n\n`. */
export function sseFrame(event: PipelineEvent): string {
  return `event: ${event.kind}\ndata: ${JSON.stringify(event)}\n\n`;
}

/** Standard SSE response headers. */
export const SSE_HEADERS: Record<string, string> = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};
