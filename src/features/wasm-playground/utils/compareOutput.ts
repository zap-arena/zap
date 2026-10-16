/**
 * Normalizes stdout/expectedOutput by trimming leading and trailing whitespace
 * and normalizing CRLF to LF line endings.
 */
export function normalizeOutput(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

/**
 * Compares actual and expected outputs after normalization.
 */
export function compareOutputs(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
