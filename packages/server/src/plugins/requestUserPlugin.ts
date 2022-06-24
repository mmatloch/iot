import { ApplicationPlugin, createApplicationPlugin } from '@common/application';
import JWT, { JsonWebTokenError } from 'jsonwebtoken';
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
            throw Errors.unauthorized({ detail: 'Invalid authorization header' });
        }

        if (tokenType === 'JWT' && token) {
            let decodedToken: string | JWT.JwtPayload;

            try {
                decodedToken = JWT.verify(token, config.authorization.jwtSecret, {
                    algorithms: ['HS256'],
                    complete: false,
                });
            } catch (e) {
                let detail = 'Invalid access token';

                if (e instanceof JsonWebTokenError) {
                    detail += `: ${e.message}`;
                }

                throw Errors.unauthorized({ detail, cause: e });
            }

            if (_.isString(decodedToken)) {
                throw Errors.unauthorized({ detail: 'Invalid access token: jwt malformed' });
            }

            const requiredFields = ['sub', 'email', 'role'];

            requiredFields.forEach((field) => {
                if (!_.has(decodedToken, field)) {
                    throw Errors.unauthorized({ detail: 'Invalid access token: jwt malformed' });
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

        throw Errors.unauthorized({ detail: 'Invalid authorization header' });
    });
};

export default createApplicationPlugin(requestUserPlugin, {
    name: 'RequestUser',
});
