export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}

export function nextStreak(state: StreakState | null, today: Date): StreakState {
  const yesterday = new Date(today.getTime() - 86_400_000);
  const lastTime = state?.lastActivityDate?.getTime();
  const currentStreak = lastTime === today.getTime()
    ? (state?.currentStreak ?? 1)
    : lastTime === yesterday.getTime()
      ? (state?.currentStreak ?? 0) + 1
      : 1;

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, state?.longestStreak ?? 0),
    lastActivityDate: today,
  };
}
