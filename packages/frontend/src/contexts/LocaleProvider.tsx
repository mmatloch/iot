import { AvailableLanguage } from '@definitions/localeTypes';
import { setDefaultOptions } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'use-local-storage';

import { LocaleContext } from './LocaleContext';

interface Props {
    children: ReactNode;
}

const parser = (v: string) => v as AvailableLanguage;
const serializer = (v: string | undefined) => String(v);

export const LocaleProvider = ({ children }: Props) => {
    const [locale, setLocale] = useLocalStorage<AvailableLanguage>('i18nextLng', AvailableLanguage.English, {
        parser,
        serializer,
    });
    const { i18n } = useTranslation();

    const setDefaults = (lang: AvailableLanguage) => {
        switch (lang) {
            case AvailableLanguage.English:
                {
                    setDefaultOptions({ locale: enUS });
                }
                break;
            case AvailableLanguage.Polish:
                {
                    setDefaultOptions({ locale: pl });
                }
                break;
            default:
                throw new Error(`Unsupported language '${lang}'`);
        }
    };

    useEffect(() => {
        setDefaults(locale);
    }, [locale]);

    const value = useMemo(() => {
        const changeLanguage = (lang: AvailableLanguage) => {
            setDefaults(lang);

            i18n.changeLanguage(lang);

            setLocale(lang);
        };

        return {
            locale,
            changeLanguage,
        };
    }, [i18n, locale, setLocale]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};
