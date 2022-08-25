import { createConfigurationHelpers } from '../../helpers/helpers.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';

const H = createConfigurationHelpers();
const configurationUtils = createConfigurationUtils();

/**
 * @group configurations/searchConfigurations
 */

describe('Configurations searchConfigurations', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    describe('type ZIGBEE_BRIDGE', () => {
        it(`should find the device by 'data'`, async () => {
            // given
            await configurationUtils.ensureZigbeeBridge();

            const query = {
                filters: {
                    data: {
                        $json: JSON.stringify({
                            type: 'ZIGBEE_BRIDGE',
                        }),
                    },
                },
            };

            // when & then
            await H.repeatSearch(query).expectHits(1);
        });
    });
});
