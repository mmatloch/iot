import {
    generateConfigurationData,
    generateConfigurationPostPayload,
} from '../dataGenerators/configurationsDataGenerators.mjs';
import { createConfigurationHelpers } from '../helpers/helpers.mjs';

const configurationHelpers = createConfigurationHelpers();

export const createConfigurationUtils = () => {
    configurationHelpers.authorizeHttpClient();

    const ensureZigbeeBridge = async (customPayload) => {
        let payload = customPayload;

        if (!payload) {
            payload = generateConfigurationPostPayload();
            payload.data = generateConfigurationData.zigbeeBridge();
        }

        const query = {
            filters: {
                data: {
                    $json: JSON.stringify({
                        type: payload.data.type,
                    }),
                },
            },
            relations: {
                _createdByUser: true,
            },
        };

        const {
            body: {
                _hits: [configuration],
            },
        } = await configurationHelpers.search(query).expectSuccess();

        if (configuration) {
            if (configuration.state !== 'ACTIVE') {
                const patchPayload = {
                    state: 'ACTIVE',
                };

                const { body: updatedConfiguration } = await configurationHelpers
                    .patchById(configuration._id, patchPayload)
                    .expectSuccess();

                return updatedConfiguration;
            }

            return configuration;
        }

        try {
            const {
                body: { createdConfiguration },
            } = await configurationHelpers.post(payload).expectSuccess();

            return createdConfiguration;
        } catch (e) {
            return ensureZigbeeBridge(payload);
        }
    };

    return {
        ensureZigbeeBridge,
    };
};
