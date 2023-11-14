import i18n, {Resource} from 'i18next';
import {initReactI18next} from 'react-i18next';
import JaTranslation from './ja.json';

const resources: Resource = {
  ja: {
    translation: JaTranslation,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources, // Manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    lng: 'ja', // if you're using a language detector, do not define the lng option
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    compatibilityJSON: 'v3',
  })
  .then();
