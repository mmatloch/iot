import _ from 'lodash';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { MqttClient } from '../../clients/mqttClient';
import { Configuration, ConfigurationState, ConfigurationType } from '../../entities/configurationEntity';
import { createConfigurationSubscriber } from '../../entities/configurationEntitySubscriber';
import { EntitySubscriberEvent } from '../../entities/subscriberDefinitions';
import { createConfigurationsService } from '../../services/configurationsService';
import { createZigbeeDataPublisher } from './zigbeeDataPublisher';
import { createZigbeeDataReceiver } from './zigbeeDataReceiver';

export const createZigbeeBridge = (mqttClient: MqttClient) => {
    const dataPublisher = createZigbeeDataPublisher(mqttClient);
    const dataReceiver = createZigbeeDataReceiver(mqttClient);

    const initialize = async () => {
        setupEntitySubscribers();

        await fetchConfiguration();
    };

    const setupEntitySubscribers = () => {
        createConfigurationSubscriber(EntitySubscriberEvent.AfterInsert, onCreatedConfiguration);
        createConfigurationSubscriber(EntitySubscriberEvent.AfterUpdate, onUpdatedConfiguration);
    };

    const fetchConfiguration = async () => {
        const service = createConfigurationsService();

        const [configuration] = await service.searchByDataType(ConfigurationType.ZigbeeBridge);

        if (configuration) {
            onCreatedConfiguration(configuration);
        }
    };

    const isZigbeeBridgeConfiguration = (configuration: Configuration) =>
        configuration.data.type === ConfigurationType.ZigbeeBridge;

    const onCreatedConfiguration = async (configuration: Configuration) => {
        if (isZigbeeBridgeConfiguration(configuration) && configuration.state === ConfigurationState.Active) {
            dataPublisher.initialize(configuration.data);
            await dataReceiver.initialize(configuration.data);
        }
    };

    const onUpdatedConfiguration = async (configuration: Configuration, updatedColumns: ColumnMetadata[]) => {
        if (isZigbeeBridgeConfiguration(configuration)) {
            if (configuration.state === ConfigurationState.Inactive) {
                dataPublisher.finalize();
                await dataReceiver.finalize();
                return;
            }

            const updatedFields = _.uniq(updatedColumns.map((columnMetadata) => columnMetadata.propertyName));

            if (updatedFields.includes('data')) {
                dataPublisher.finalize();
                await dataReceiver.finalize();
            }

            dataPublisher.initialize(configuration.data);
            await dataReceiver.initialize(configuration.data);
        }
    };

    return {
        initialize,
    };
};
