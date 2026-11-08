/**
 * Quiet sounds that confirm an action. They are generated in the browser, so
 * no sound files are downloaded. Sounds only ever follow something the learner
 * did, and they can be switched off in Settings.
 */
const STORAGE_KEY = 'digital-boomer-sound';

let context: AudioContext | null = null;
let soundOn = readSetting();

function readSetting(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function isSoundOn(): boolean {
  return soundOn;
}

export function setSoundOn(on: boolean): void {
  soundOn = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Without storage the choice simply lasts until the next visit.
  }
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  if (!context) context = new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(frequency: number, startIn: number, duration: number, volume: number, type: OscillatorType = 'sine'): void {
  const ctx = getContext();
  if (!ctx) return;
  const start = ctx.currentTime + startIn;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function play(sound: () => void): void {
  if (!soundOn) return;
  try {
    sound();
  } catch {
    // Sound is only an extra: a browser without audio just stays quiet.
  }
}

/** A soft, short tick for every button or link. */
export function playClick(): void {
  play(() => tone(1250, 0, 0.035, 0.05, 'triangle'));
  if (soundOn && navigator.vibrate) navigator.vibrate(8); // a light tap on phones that support it
}

/** Two rising notes: that was the right spot. */
export function playCorrect(): void {
  play(() => {
    tone(660, 0.03, 0.12, 0.05);
    tone(880, 0.12, 0.16, 0.05);
  });
}

/** A low, calm note: try again. It is deliberately not an error sound. */
export function playTryAgain(): void {
  play(() => tone(330, 0.03, 0.16, 0.04));
}

/** A message left the phone. */
export function playSent(): void {
  play(() => {
    tone(520, 0, 0.07, 0.04);
    tone(780, 0.05, 0.1, 0.04);
  });
}

/** A message arrived on the simulated phone. */
export function playReceived(): void {
  play(() => {
    tone(880, 0, 0.09, 0.04);
    tone(660, 0.09, 0.14, 0.04);
  });
}

/** The lesson is finished. */
export function playSuccess(): void {
  play(() => {
    tone(523, 0, 0.14, 0.05);
    tone(659, 0.12, 0.14, 0.05);
    tone(784, 0.24, 0.26, 0.05);
  });
}
