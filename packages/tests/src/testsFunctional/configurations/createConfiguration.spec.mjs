import {
    generateConfigurationData,
    generateConfigurationPostPayload,
} from '../../dataGenerators/configurationsDataGenerators.mjs';
import { createConfigurationHelpers } from '../../helpers/helpers.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';

const H = createConfigurationHelpers();
const configurationUtils = createConfigurationUtils();

/**
 * @group configurations/createConfiguration
 */

describe('Configurations createConfiguration', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    describe('type ZIGBEE_BRIDGE', () => {
        it('should return an error if a configuration with type `ZIGBEE_BRIDGE` already exists', async () => {
            // given
            const payload = generateConfigurationPostPayload();
            payload.data = generateConfigurationData.zigbeeBridge();

            await configurationUtils.ensureZigbeeBridge(payload);

            // when & then
            await H.post(payload).expectConflict({
                errorCode: 'SRV-6',
                message: `Configuration already exists`,
                detail: `Key ((data ->> 'type'::text))=(ZIGBEE_BRIDGE) already exists.`,
            });
        });
    });
});
