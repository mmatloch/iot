import { LocaleContext } from '@contexts/LocaleContext';
import { useContext } from 'react';

export const useLocale = () => {
    return useContext(LocaleContext);
};
