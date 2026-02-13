import { TH } from './th';
import { EN } from './en';

export const LANGUAGES = {
  en: { label: 'English', dictionary: EN },
  th: { label: 'ไทย', dictionary: TH },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
export type Dictionary = typeof TH;
