import { AvailableLanguage } from '@definitions/localeTypes';
import { createContext } from 'react';

interface Context {
    locale: AvailableLanguage;
    changeLanguage: (lang: AvailableLanguage) => void;
}

export const LocaleContext = createContext<Context>({
    locale: AvailableLanguage.English,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    changeLanguage: () => {},
});
