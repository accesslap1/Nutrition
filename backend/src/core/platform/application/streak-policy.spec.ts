import { nextStreak } from '../domain/streak-policy';
import { describe, expect, it } from 'vitest';

describe('nextStreak', () => {
  const today = new Date('2026-09-14T00:00:00.000Z');

  it('starts at one', () => expect(nextStreak(null, today).currentStreak).toBe(1));

  it('does not increment twice on one day', () => {
    expect(nextStreak({ currentStreak: 4, longestStreak: 7, lastActivityDate: today }, today))
      .toMatchObject({ currentStreak: 4, longestStreak: 7 });
  });

  it('increments a consecutive day', () => {
    const yesterday = new Date('2026-09-13T00:00:00.000Z');
    expect(nextStreak({ currentStreak: 4, longestStreak: 4, lastActivityDate: yesterday }, today))
      .toMatchObject({ currentStreak: 5, longestStreak: 5 });
  });

  it('resets after a missed day', () => {
    const old = new Date('2026-09-11T00:00:00.000Z');
    expect(nextStreak({ currentStreak: 4, longestStreak: 8, lastActivityDate: old }, today))
      .toMatchObject({ currentStreak: 1, longestStreak: 8 });
  });
});
