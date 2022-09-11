import { generateZigbeeBridgeRequestPayload } from '../../dataGenerators/bridgeDataGenerators.mjs';
import { createConfigurationHelpers } from '../../helpers/helpers.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';

const configurationHelpers = createConfigurationHelpers();
const configurationUtils = createConfigurationUtils();

const buildDataQuery = (partialQuery) => {
    return {
        filters: {
            data: {
                $json: JSON.stringify({ type: 'ZIGBEE_BRIDGE', ...partialQuery }),
            },
        },
    };
};

/**
 * @group zigbeeBridge/bridgeRequest
 */

describe('Zigbee bridge request', () => {
    let H, configuration;

    beforeAll(async () => {
        configuration = await configurationUtils.ensureZigbeeBridge();

        H = createConfigurationHelpers({
            path: `configurations/${configuration._id}/bridge`,
        });

        H.authorizeHttpClient();
        configurationHelpers.authorizeHttpClient();

        await connectToBroker();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it('should update `permitDevicesJoin`', async () => {
        // disable device joining
        const payload = generateZigbeeBridgeRequestPayload.permitDevicesJoin();
        payload.value = false;

        await H.put(payload).expectSuccess();

        const {
            body: {
                _hits: [firstConfig],
            },
        } = await configurationHelpers.repeatSearch(buildDataQuery({ permitDevicesJoin: false })).expectHits(1);

        expect(firstConfig).toHaveProperty('data.permitDevicesJoin', false);
        expect(firstConfig).not.toHaveProperty('data.permitDevicesJoinStartAt');
        expect(firstConfig).not.toHaveProperty('data.permitDevicesJoinEndAt');

        // enable device joining
        payload.value = true;
        payload.time = 5;

        await H.put(payload).expectSuccess();

        const {
            body: {
                _hits: [secondConfig],
            },
        } = await configurationHelpers.repeatSearch(buildDataQuery({ permitDevicesJoin: true })).expectHits(1);

        expect(secondConfig).toHaveProperty('data.permitDevicesJoin', true);
        expect(secondConfig).toHaveProperty('data.permitDevicesJoinStartAt');
        expect(secondConfig).toHaveProperty('data.permitDevicesJoinEndAt');

        // disable device joining again
        payload.value = false;

        await H.put(payload).expectSuccess();

        const {
            body: {
                _hits: [thirdConfig],
            },
        } = await configurationHelpers.repeatSearch(buildDataQuery({ permitDevicesJoin: false })).expectHits(1);

        expect(thirdConfig).toHaveProperty('data.permitDevicesJoin', false);
        expect(thirdConfig).not.toHaveProperty('data.permitDevicesJoinStartAt');
        expect(thirdConfig).not.toHaveProperty('data.permitDevicesJoinEndAt');
    });
});
