import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useEventInstanceDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentEventInstanceId, setCurrentEventInstanceId] = useState<number>();

    useEffect(() => {
        const eventInstanceId = Number(searchParams.get('showEventInstance'));

        if (Number.isInteger(eventInstanceId)) {
            setCurrentEventInstanceId(eventInstanceId);
        }
    }, [searchParams]);

    const openEventInstanceDetails = (eventInstanceId: number) => {
        searchParams.set('showEventInstance', String(eventInstanceId));
        setSearchParams(searchParams);
    };

    const closeEventInstanceDetails = () => {
        searchParams.delete('showEventInstance');
        setSearchParams(searchParams);
    };

    return {
        openEventInstanceDetails,
        closeEventInstanceDetails,
        isOpen: !!currentEventInstanceId,
        eventInstanceId: currentEventInstanceId,
    };
}
