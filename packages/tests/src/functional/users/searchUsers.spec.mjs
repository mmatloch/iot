import _ from 'lodash';

import { createUserHelpers } from '../../helpers/helpers.mjs';
import { createUserUtils } from '../../utils/userUtils.mjs';

const H = createUserHelpers();
const { createUser } = createUserUtils();

/**
 * @group users/searchUsers
 */

describe('Users searchUsers', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    it('should find the user by email', async () => {
        // given
        const numberOfUsers = 3;
        const [firstUser, secondUser] = await Promise.all(_.times(numberOfUsers, createUser));

        // when
        const { body: firstUserResult } = await H.search({
            email: firstUser.email,
        }).expectHits(1);

        const { body: secondUserResult } = await H.search({
            email: secondUser.email,
        }).expectHits(1);

        // then
        expect(firstUserResult._hits[0]).toHaveProperty('email', firstUser.email);
        expect(secondUserResult._hits[0]).toHaveProperty('email', secondUser.email);
    });

    it('should return all users when no filter is specified', async () => {
        // given
        const numberOfUsers = 3;
        await Promise.all(_.times(numberOfUsers, createUser));

        const searchQuery = {};

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        expect(body._hits.length).toBeGreaterThanOrEqual(numberOfUsers);
    });
});
