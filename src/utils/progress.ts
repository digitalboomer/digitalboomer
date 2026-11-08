/**
 * Saves learning progress in this browser only (localStorage), so a guest
 * can continue later without an account. Nothing is sent to a server.
 */
const STORAGE_KEY = 'digital-boomer-progress';

export interface SavedProgress {
  completedTutorialIds: string[];
  savedTutorialIds: string[];
  /** Tutorial ID → zero-based step where the learner stopped. */
  tutorialSteps: Record<string, number>;
}

const EMPTY_PROGRESS: SavedProgress = {
  completedTutorialIds: [],
  savedTutorialIds: [],
  tutorialSteps: {},
};

export function loadProgress(): SavedProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return {
      completedTutorialIds: Array.isArray(stored.completedTutorialIds) ? stored.completedTutorialIds : [],
      savedTutorialIds: Array.isArray(stored.savedTutorialIds) ? stored.savedTutorialIds : [],
      tutorialSteps: stored.tutorialSteps && typeof stored.tutorialSteps === 'object' ? stored.tutorialSteps : {},
    };
  } catch {
    // Storage can be blocked or hold broken data. The learner simply starts fresh.
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Without storage, the lesson still works; progress just is not kept.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
