import { ApplicationPlugin, createApplicationPlugin } from '@common/application';
import JWT from 'jsonwebtoken';
import _ from 'lodash';

import { getConfig } from '../config';
import { Errors } from '../errors';

const config = getConfig();

const requestUserPlugin: ApplicationPlugin = async (app) => {
    app.decorateRequest('user', null);

    app.addHook('onRequest', async (request) => {
        const authorizationHeader = request.headers.authorization;
        if (!_.isString(authorizationHeader)) {
            return;
        }

        const [tokenType, token] = authorizationHeader.split(' ');

        if (!tokenType || !token) {
            throw Errors.invalidAuthorizationHeader();
        }

        if (tokenType === 'JWT' && token) {
            const decodedToken = JWT.verify(token, config.authorization.jwtSecret, {
                algorithms: ['HS256'],
                complete: false,
            });

            if (_.isString(decodedToken)) {
                throw Errors.invalidAccessToken('jwt malformed');
            }

            const requiredFields = ['sub', 'email', 'role'];

            requiredFields.forEach((field) => {
                if (!_.has(decodedToken, field)) {
                    throw Errors.invalidAccessToken('jwt malformed');
                }
            });

            const user = {
                _id: decodedToken.sub,
                email: decodedToken.email,
                role: decodedToken.role,
            };

            request.user = user;
            return;
        }

        throw Errors.invalidAuthorizationHeader();
    });
};

export default createApplicationPlugin(requestUserPlugin, {
    name: 'RequestUser',
});
