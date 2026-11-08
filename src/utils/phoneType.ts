import { useSyncExternalStore } from 'react';

/** Where the learner uses the apps. The practice screens follow it. */
export type Device = 'iphone' | 'android' | 'computer';
/** The phone look of a simulated phone screen. */
export type PhoneType = 'iphone' | 'android';

const STORAGE_KEY = 'digital-boomer-phone';
const listeners = new Set<() => void>();

function read(): Device | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'iphone' || saved === 'android' || saved === 'computer' ? saved : null;
  } catch {
    return null;
  }
}

let current = read();

export function setDevice(device: Device): void {
  current = device;
  try {
    localStorage.setItem(STORAGE_KEY, device);
  } catch {
    // Without storage the choice simply lasts until the next visit.
  }
  listeners.forEach((listener) => listener());
}

/** Kept for older callers. */
export const setPhoneType = setDevice;

export function clearPhoneType(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing was saved, so there is nothing to clear.
  }
  current = null;
  listeners.forEach((listener) => listener());
}

/** The chosen device, or null when the learner has not chosen yet. */
export function useChosenDevice(): Device | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current
  );
}

/** Kept for older callers. */
export const useChosenPhone = useChosenDevice;

/** Where to show lessons. A phone (Android) until the learner chooses. */
export function useDevice(): Device {
  return useChosenDevice() ?? 'android';
}

/** "Get started on the computer" lessons are only listed after the learner chose "Computer". */
export function fitsDevice(lesson: { practice?: { device?: string } }, device: Device | null): boolean {
  return lesson.practice?.device !== 'desktop' || device === 'computer';
}

/** The phone look for simulated phone screens. On the computer, screens use the neutral (Android-like) parts. */
export function usePhoneType(): PhoneType {
  return useDevice() === 'iphone' ? 'iphone' : 'android';
}
