/**
 * "Was this lesson easy?": saves an anonymous answer in the Supabase table "lesson_feedback"
 * (insert only, nobody can read it through the website). Setup: docs/lesson-feedback-setup.md.
 * Nothing about the person is sent: only the lesson, the answer, an optional comment,
 * the language and the device chosen in the lesson.
 */
import { getSupabase } from './auth';

export type LessonRating = 'easy' | 'okay' | 'hard';

export interface LessonFeedback {
  lessonId: string;
  rating: LessonRating;
  comment: string;
  lang: string;
  device: '' | 'iphone' | 'android' | 'computer';
}

/** True when the answer was saved. */
export async function sendLessonFeedback(feedback: LessonFeedback): Promise<boolean> {
  try {
    const supabase = await getSupabase(); // loaded on first use
    if (!supabase) return false;
    const { error } = await supabase.from('lesson_feedback').insert({
      lesson_id: feedback.lessonId.slice(0, 80),
      rating: feedback.rating,
      comment: feedback.comment.trim().slice(0, 500),
      lang: feedback.lang.slice(0, 5),
      device: feedback.device,
    });
    return !error;
  } catch {
    return false;
  }
}
