const userStates = new Map<string, string>();

export function setUserState(userId: string, state: string) {
  userStates.set(userId, state);
}

export function getUserState(userId: string): string | undefined {
  return userStates.get(userId);
}

export function clearUserState(userId: string) {
  userStates.delete(userId);
}
