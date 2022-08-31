import i18n, { Resource, ResourceLanguage } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { EnglishLocale } from './locales/en';
import { PolishLocale } from './locales/pl';

const resources: Resource = {
    en: EnglishLocale as unknown as ResourceLanguage,
    pl: PolishLocale as unknown as ResourceLanguage,
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'en',
        debug: false,
        resources: resources,

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
