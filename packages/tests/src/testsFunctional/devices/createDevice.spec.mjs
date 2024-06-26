import { generateDevicePostPayload } from '../../dataGenerators/devicesDataGenerators.mjs';
import { createDeviceHelpers } from '../../helpers/helpers.mjs';

const H = createDeviceHelpers();

/**
 * @group devices/createDevice
 */

describe('Devices createDevice', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    it('should create a device', async () => {
        // given
        const payload = generateDevicePostPayload();

        // when
        const { body: device } = await H.post(payload).expectSuccess();

        // then
        expect(device).toMatchObject(payload);
        expect(device).toHaveProperty('_id');
        expect(device).toHaveProperty('_version', 1);
        expect(device).toHaveProperty('_createdAt');
        expect(device).toHaveProperty('_updatedAt');
    });

    it('should return an error if a device with this `displayName` already exists', async () => {
        // given
        const { body: device } = await H.post(generateDevicePostPayload()).expectSuccess();

        const payload = generateDevicePostPayload();
        payload.displayName = device.displayName;

        // when & then
        await H.post(payload).expectConflict({
            errorCode: 'SRV-6',
            message: `Device already exists`,
            detail: `Key ("displayName")=(${payload.displayName}) already exists.`,
        });
    });
});
