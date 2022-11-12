import { formatDistance, formatISO9075 } from 'date-fns';

export const formatRelativeDate = (date: string) => formatDistance(new Date(date), new Date(), { addSuffix: true });
export const formatFullDate = (date: string) =>
    formatISO9075(new Date(date), {
        representation: 'complete',
    });
