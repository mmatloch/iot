import type { Application, ApplicationPlugin } from '@common/application';

import { Device } from '../entities/deviceEntity';
import { createDeviceSubscriber } from '../entities/deviceEntitySubscriber';
import { EntitySubscriberEvent } from '../entities/subscriberDefinitions';

enum MessageType {
    Status = 'STATUS',
    DeviceCreated = 'DEVICE_CREATED',
    DeviceUpdated = 'DEVICE_UPDATED',
}

const setupEntitySubscribers = (app: Application) => {
    const publishToAll = (message: Record<string, unknown>) => {
        app.websocketServer.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(message));
            }
        });
    };

    const onDeviceCreatedEvent = (device: Device) => {
        publishToAll({
            type: MessageType.DeviceCreated,
            device,
        });
    };

    const onDeviceUpdatedEvent = (device: Device) => {
        publishToAll({
            type: MessageType.DeviceUpdated,
            device,
        });
    };

    createDeviceSubscriber(EntitySubscriberEvent.AfterInsert, onDeviceCreatedEvent);
    createDeviceSubscriber(EntitySubscriberEvent.AfterUpdate, onDeviceUpdatedEvent);
};

export const createWebsocketRoute: ApplicationPlugin = async (app) => {
    app.get('/live', { websocket: true }, (connection) => {
        connection.socket.send(JSON.stringify({ type: MessageType.Status, status: 'CONNECTED' }));
    });

    setupEntitySubscribers(app);
};
