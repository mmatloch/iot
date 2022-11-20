import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppRoute } from '../../../constants';

export function useDeviceDetails() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentDeviceId, setCurrentDeviceId] = useState<number>();

    useEffect(() => {
        const deviceId = Number(searchParams.get('showDevice'));

        if (Number.isInteger(deviceId)) {
            setCurrentDeviceId(deviceId);
        }
    }, [searchParams]);

    const openDeviceDetails = (deviceId: number) => {
        searchParams.set('showDevice', String(deviceId));
        setSearchParams(searchParams);
    };

    const navigateAndOpenDeviceDetails = (deviceId: number) => {
        searchParams.set('showDevice', String(deviceId));
        navigate(`${AppRoute.Devices.Root}?${searchParams.toString()}`);
    };

    const closeDeviceDetails = () => {
        searchParams.delete('showDevice');
        setSearchParams(searchParams);
    };

    return {
        openDeviceDetails,
        navigateAndOpenDeviceDetails,
        closeDeviceDetails,
        isOpen: !!currentDeviceId,
        deviceId: currentDeviceId,
    };
}
