import { message } from "antd";
import { useLanguageStore } from "../store/languageStore";
import { LANGUAGES } from "../constants/languages";

export const handleError = (error: unknown, fallbackMessage?: string) => {
  console.error("App Error:", error);

  // Get current language dictionary manually since this is not a hook
  const { currentLanguage } = useLanguageStore.getState();
  const t = LANGUAGES[currentLanguage].dictionary;
  
  const defaultMessage = fallbackMessage || t.COMMON.ERROR;

  if (error instanceof Error) {
    message.error(error.message);
  } else if (typeof error === "string") {
    message.error(error);
  } else {
    message.error(defaultMessage);
  }
};
