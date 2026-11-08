/**
 * Web Speech API utility for Senior Learner Voice Guidance
 * Supports natural English and German speech synthesis, and Turkish, Spanish and Croatian through the translation layer
 */
import { speechLanguage, translateText } from '../i18n/translate';

export function speakText(
  text: string,
  onEnd?: () => void,
  onStart?: () => void,
  lang: 'en' | 'de' = 'en'
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any active utterance

    // In Turkish, Spanish or Croatian the English text is translated first.
    const cleanText = translateText(text.replace(/[*_#•►▼]/g, ' ').trim());
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLanguage(lang);
    utterance.rate = 0.88; // Slightly slower, calm cadence tailored for senior learners
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetLangPrefix = utterance.lang.slice(0, 2);
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith(targetLangPrefix) &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Anna') ||
          v.name.includes('Markus'))
    ) || voices.find((v) => v.lang.startsWith(targetLangPrefix));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis not available', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export const stopSpeaking = stopSpeech;
