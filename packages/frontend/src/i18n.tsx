import type { Resource, ResourceLanguage } from 'i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
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
        defaultNS: 'common',
        fallbackLng: 'en',
        debug: false,
        resources: resources,

        interpolation: {
            escapeValue: false,
            format: (value, format) => {
                switch (format) {
                    case 'upperCase':
                        return value.toUpperCase();
                    case 'lowerCase':
                        return value.toLowerCase();
                    case 'upperFirst':
                        return upperFirst(value);
                    case 'lowerFirst':
                        return lowerFirst(value);
                }

                return value;
            },
        },

        detection: {
            caches: [], // cached by LocaleContext
        },
    });

export default i18n;
