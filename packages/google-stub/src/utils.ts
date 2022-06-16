import crypto from 'node:crypto';

import _ from 'lodash';

export const getRandomString = (length = 12): string => crypto.randomBytes(Math.round(length / 2)).toString('hex');
export const getRandomNumericString = (length = 12): string => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return _.times(length, () => _.sample(numbers)).join('');
};
