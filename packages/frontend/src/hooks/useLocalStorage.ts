import { useState } from 'react';

export const useLocalStorage = (key: string) => {
    const [storedValue, setStoredValue] = useState(() => {
        const item = window.localStorage.getItem(key);

        if (item === null) {
            return undefined;
        }

        return item;
    });

    const setValue = (newValue: string | undefined) => {
        if (newValue === undefined) {
            window.localStorage.removeItem(key);
        } else {
            window.localStorage.setItem(key, newValue);
        }

        setStoredValue(newValue);
    };

    return [storedValue, setValue] as const;
};
