import { faker } from '@faker-js/faker';

import { createConfigurationHelpers } from '../../helpers/helpers.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';

const H = createConfigurationHelpers();
const configurationUtils = createConfigurationUtils();

/**
 * @group configurations/getConfiguration
 */

describe('Configurations getConfiguration', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    it('should get the configuration', async () => {
        // given
        const createdConfiguration = await configurationUtils.ensureZigbeeBridge();

        // when
        const { body: configuration } = await H.getById(createdConfiguration._id).expectSuccess();

        // then
        expect(configuration).toStrictEqual(createdConfiguration);
    });

    it('should return an error if the configuration does not exist', async () => {
        await H.getById(faker.datatype.number({ min: 1000000 })).expectNotFound({
            message: 'Configuration does not exist',
            errorCode: 'SRV-5',
        });
    });
});
