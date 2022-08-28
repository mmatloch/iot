import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pl from './locales/pl.json';

const resources = {
    en,
    pl,
};

export enum AvailableLanguage {
    English = 'en',
    Polish = 'pl',
}

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
