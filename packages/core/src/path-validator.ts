// Validates `state` binding paths before they are resolved against the run
// state. Pure: no engine dependencies. Guards against prototype-pollution
// segments, over-long paths, and over-deep traversals.

const FORBIDDEN_SEGMENTS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

const MAX_PATH_LENGTH = 256;
const MAX_PATH_DEPTH = 16;

/**
 * First segment: an identifier (`outputs`, `meta`, ... — top-level keys are
 * restricted for safety). Subsequent segments may be:
 *   - `.identifier` (UUIDs with dashes allowed)
 *   - `[n]` (bracket index)
 *   - `.[n]` (dot + bracket — some UIs join path segments with a leading dot)
 */
const PATH_REGEX = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z0-9_-]+|\.?\[\d+\])*$/;

export type PathValidationResult = { valid: true } | { valid: false; error: string };

export function validateStatePath(path: string): PathValidationResult {
  if (path.length === 0 || path.length > MAX_PATH_LENGTH) {
    return { valid: false, error: 'INVALID_LENGTH' };
  }
  if (!PATH_REGEX.test(path)) {
    return { valid: false, error: 'INVALID_GRAMMAR' };
  }
  const tokens = path.split(/[.[\]]/).filter((t) => t.length > 0);
  if (tokens.length > MAX_PATH_DEPTH) {
    return { valid: false, error: 'INVALID_DEPTH' };
  }
  for (const t of tokens) {
    if (FORBIDDEN_SEGMENTS.has(t)) {
      return { valid: false, error: `FORBIDDEN_SEGMENT:${t}` };
    }
  }
  return { valid: true };
}
