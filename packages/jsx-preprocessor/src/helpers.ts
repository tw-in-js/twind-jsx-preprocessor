export function isTruthy<T>(value: T): value is Exclude<T, undefined | null | false | 0 | ''> {
  return Boolean(value)
}
