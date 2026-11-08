/**
 * Centralized, production-safe Image Asset Map
 * Ensures Vite bundles and hashes image assets for production builds
 * while simultaneously providing stable public fallbacks for static hosting.
 */

import heroSeniorWomanImport from './images/hero_senior_woman_1793286326933.jpg';
import seniorManLaptopImport from './images/senior_man_laptop_1793286327955.jpg';
import topicEmailLaptopImport from './images/topic_email_laptop_1793286349854.jpg';
import topicWhatsappPhoneImport from './images/topic_whatsapp_phone_1793286329684.jpg';
import topicBankingPhoneImport from './images/topic_banking_phone_1793286329225.jpg';
import topicSocialMediaImport from './images/topic_social_media_1793286349022.jpg';
import topicAiRobotImport from './images/topic_ai_robot_1793286328263.jpg';
import officialLogoImport from './images/digital_boomer_logo.png';
import topicEmailIllustration from './images/topic_email_illustration.svg';
import topicSafetyIllustration from './images/topic_safety_illustration.svg';

export const IMAGES = {
  heroSeniorWoman: heroSeniorWomanImport || '/assets/images/hero_senior_woman_1793286326933.jpg',
  seniorManLaptop: seniorManLaptopImport || '/assets/images/senior_man_laptop_1793286327955.jpg',
  topicEmailLaptop: topicEmailLaptopImport || '/assets/images/topic_email_laptop_1793286349854.jpg',
  topicWhatsappPhone: topicWhatsappPhoneImport || '/assets/images/topic_whatsapp_phone_1793286329684.jpg',
  topicBankingPhone: topicBankingPhoneImport || '/assets/images/topic_banking_phone_1793286329225.jpg',
  topicSocialMedia: topicSocialMediaImport || '/assets/images/topic_social_media_1793286349022.jpg',
  topicAiRobot: topicAiRobotImport || '/assets/images/topic_ai_robot_1793286328263.jpg',
  topicEmail: topicEmailIllustration,
  topicSafety: topicSafetyIllustration,
  logo: officialLogoImport || '/assets/images/digital_boomer_logo.png',
};

/**
 * Robust image fallback handler
 * If an image fails to load (e.g. offline, connection timeout, CDN blip),
 * it tries the static public copy before falling back to a clean placeholder.
 */
/** Public files live under the site's base path (e.g. /digital-boomer/ on GitHub Pages). */
const publicPath = (path: string) => (path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path);

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackPath: string = '/assets/images/hero_senior_woman_1793286326933.jpg'
) => {
  const target = e.currentTarget;
  const fallback = publicPath(fallbackPath);
  if (!target.src.includes(fallback)) {
    target.src = fallback;
  }
};

/**
 * Logo fallback: tries the static public copy once, so it can never retry in a loop
 */
export const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  const fallbackPath = publicPath('/assets/images/digital_boomer_logo.png');
  if (!target.src.endsWith(fallbackPath)) {
    target.src = fallbackPath;
  }
};

