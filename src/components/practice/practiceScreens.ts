import React from 'react';
import { MessengerScreen } from './messaging/MessengerScreen';
import { BankingScreen } from './BankingScreen';
import { EmailScreen } from './EmailScreen';
import { SocialScreen } from './SocialScreen';
import { AiChatScreen } from './AiChatScreen';
import { DesktopBank, DesktopEmail, DesktopMessenger, DesktopSocial } from './DesktopScreens';

export interface PracticeScreenProps {
  /** The simulated screen of the current step, from `practice.screen` in the lesson. */
  screen: string;
  isDone: boolean;
  appId?: string;
  kind?: string;
  labels: Record<string, string>;
  lang: string;
}

/**
 * Simulated screens by `practice.screenId`. To add a scenario: write a screen
 * using PracticeTap, register it here, and add the lesson to practiceLessons.ts.
 */
export const PRACTICE_SCREENS: Record<string, React.ComponentType<PracticeScreenProps>> = {
  messenger: MessengerScreen,
  banking: BankingScreen,
  email: EmailScreen,
  social: SocialScreen,
  ai: AiChatScreen,
  'desktop-messenger': DesktopMessenger,
  'desktop-email': DesktopEmail,
  'desktop-social': DesktopSocial,
  'desktop-bank': DesktopBank,
};
