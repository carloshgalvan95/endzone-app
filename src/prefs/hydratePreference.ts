/** Keep a choice made this session. A late storage read must not put the old value back. */
export function hydratePreference<T extends string>(
  stored: string | null,
  current: T,
  userChanged: boolean,
  allowed: readonly T[],
): T {
  if (userChanged) {
    return current;
  }
  if (stored != null && (allowed as readonly string[]).includes(stored)) {
    return stored as T;
  }
  return current;
}
