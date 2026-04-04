import { closeSnackbar, useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import useWebSocket from 'react-use-websocket';
import { useEffect, useRef } from 'react';

import { ApiRoute, WEBSOCKET_URL } from '../../../constants';
import { usePageActivity } from '../../../hooks/usePageActivity';

enum MessageType {
    Status = 'STATUS',
    DeviceCreated = 'DEVICE_CREATED',
    DeviceUpdated = 'DEVICE_UPDATED',
}

export const useLiveDashboard = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const { isActive: isPageActive } = usePageActivity();
    const wasPageActiveRef = useRef(isPageActive);
    const shouldRefreshAfterReconnectRef = useRef(false);

    useEffect(() => {
        if (!wasPageActiveRef.current && isPageActive) {
            queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
        }

        wasPageActiveRef.current = isPageActive;
    }, [isPageActive, queryClient]);

    useWebSocket(WEBSOCKET_URL, {
        share: true,
        shouldReconnect: () => document.visibilityState === 'visible' && navigator.onLine,
        onOpen: () => {
            closeSnackbar('WS_RETRY');

            if (shouldRefreshAfterReconnectRef.current) {
                shouldRefreshAfterReconnectRef.current = false;
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
            }
        },
        onClose(event) {
            if (document.visibilityState !== 'visible' || !navigator.onLine) {
                return;
            }

            shouldRefreshAfterReconnectRef.current = true;

            if (!event.wasClean) {
                enqueueSnackbar(t('websockets.connectionLost'), {
                    variant: 'error',
                    preventDuplicate: true,
                    persist: true,
                    key: 'WS_RETRY',
                });
            }
        },
        onMessage(event) {
            const data = JSON.parse(event.data);

            if (data.type === MessageType.DeviceCreated || data.type === MessageType.DeviceUpdated) {
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
            }
        },
    }, isPageActive);
};
