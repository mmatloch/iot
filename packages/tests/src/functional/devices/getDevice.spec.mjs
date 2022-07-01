import { faker } from '@faker-js/faker';

import { generateDevicePostPayload } from '../../dataGenerators/devicesDataGenerators.mjs';
import { createDeviceHelpers } from '../../helpers/helpers.mjs';

const H = createDeviceHelpers();

/**
 * @group devices/getDevice
 */

describe('Devices getDevice', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    it('should get the device', async () => {
        // given
        const payload = generateDevicePostPayload();
        const { body: createdDevice } = await H.post(payload).expectSuccess();

        // when
        const { body: device } = await H.getById(createdDevice._id).expectSuccess();

        // then
        expect(device).toStrictEqual(createdDevice);
    });

    it('should return an error if the device does not exist', async () => {
        await H.getById(faker.datatype.number({ min: 1000000 })).expectNotFound({
            message: 'Device does not exist',
            errorCode: 'SRV-5',
        });
    });
});
