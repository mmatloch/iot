import { useEffect, useState } from 'react';

const isPageVisible = () => document.visibilityState === 'visible';

const isOnline = () => navigator.onLine;

const getPageActivity = () => ({
    isVisible: isPageVisible(),
    isOnline: isOnline(),
});

export const usePageActivity = () => {
    const [pageActivity, setPageActivity] = useState(getPageActivity);

    useEffect(() => {
        const updatePageActivity = () => {
            setPageActivity(getPageActivity());
        };

        updatePageActivity();

        document.addEventListener('visibilitychange', updatePageActivity);
        window.addEventListener('focus', updatePageActivity);
        window.addEventListener('pageshow', updatePageActivity);
        window.addEventListener('online', updatePageActivity);
        window.addEventListener('offline', updatePageActivity);

        return () => {
            document.removeEventListener('visibilitychange', updatePageActivity);
            window.removeEventListener('focus', updatePageActivity);
            window.removeEventListener('pageshow', updatePageActivity);
            window.removeEventListener('online', updatePageActivity);
            window.removeEventListener('offline', updatePageActivity);
        };
    }, []);

    return {
        ...pageActivity,
        isActive: pageActivity.isVisible && pageActivity.isOnline,
    };
};
