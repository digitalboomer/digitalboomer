import { useSyncExternalStore } from 'react';

/** How much help the learner wants in lessons. It is remembered, and can be changed at any time. */
export type HelpLevel = 'none' | 'tips' | 'full';

const STORAGE_KEY = 'digital-boomer-help';
const listeners = new Set<() => void>();

function read(): HelpLevel {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'none' || saved === 'tips' ? saved : 'full';
  } catch {
    return 'full';
  }
}

let current = read();

export function setHelpLevel(level: HelpLevel): void {
  current = level;
  try {
    localStorage.setItem(STORAGE_KEY, level);
  } catch {
    // Without storage the choice simply lasts until the next visit.
  }
  listeners.forEach((listener) => listener());
}

export function clearHelpLevel(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing was saved, so there is nothing to clear.
  }
  current = 'full';
  listeners.forEach((listener) => listener());
}

export function useHelpLevel(): HelpLevel {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current
  );
}
