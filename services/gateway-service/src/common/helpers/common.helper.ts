export function getDefault<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined && value !== null ? value : defaultValue;
}
