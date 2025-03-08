export function containsPattern(str: string, patterns: string[]) {
  return patterns.some(pattern => str.includes(pattern));
}