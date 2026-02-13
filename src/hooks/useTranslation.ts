import { useLanguageStore } from '../store/languageStore';
import { LANGUAGES } from '../constants/languages';

export const useTranslation = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const t = LANGUAGES[currentLanguage].dictionary;

  return { t, currentLanguage, setLanguage };
};
