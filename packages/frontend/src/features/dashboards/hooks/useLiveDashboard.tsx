import { closeSnackbar, useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import useWebSocket from 'react-use-websocket';

import { ApiRoute, WEBSOCKET_URL } from '../../../constants';

enum MessageType {
    Status = 'STATUS',
    DeviceCreated = 'DEVICE_CREATED',
    DeviceUpdated = 'DEVICE_UPDATED',
}

export const useLiveDashboard = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    useWebSocket(WEBSOCKET_URL, {
        share: true,
        shouldReconnect: () => true,
        onOpen: () => {
            closeSnackbar('WS_RETRY');
        },
        onClose(event) {
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
    });
};
