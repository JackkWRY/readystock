import dayjs from 'dayjs';
import 'dayjs/locale/th';
import 'dayjs/locale/en';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { LanguageCode } from '../constants/languages';

dayjs.extend(buddhistEra);

export const formatDate = (date: string | Date, lang: LanguageCode) => {
  if (lang === 'th') {
    return dayjs(date).locale('th').format('D MMM BB HH:mm น.');
  }
  return dayjs(date).locale('en').format('D MMM YYYY HH:mm');
};
