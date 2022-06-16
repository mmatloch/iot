import crypto from 'node:crypto';

import { faker } from '@faker-js/faker';
import formBody from '@fastify/formbody';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import createFastify from 'fastify';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';
import _ from 'lodash';

import { getRandomNumericString, getRandomString } from './utils';

const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'secret',
    },
});

const fastify = createFastify({
    logger: true,
    ajv: {
        customOptions: {
            keywords: ['kind', 'modifier'],
        },
    },
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(formBody);

const tokenSchema = {
    body: Type.Object({
        code: Type.Optional(Type.String()),
        grant_type: Type.Optional(Type.String()),
        client_id: Type.Optional(Type.String()),
        client_secret: Type.Optional(Type.String()),
    }),
};

fastify.post('/oauth2/token', { schema: tokenSchema }, async (request, reply) => {
    const expectedClientId = process.env['OAUTH2_CLIENT_ID'] || 'test';
    const expectedClientSecret = process.env['OAUTH2_CLIENT_SECRET'] || 'test';

    const { grant_type: grantType, code, client_id: clientId, client_secret: clientSecret } = request.body;

    let errorBody;

    if (grantType !== 'authorization_code') {
        errorBody = {
            error: 'unsupported_grant_type',
            error_description: `Invalid grant_type: ${grantType}`,
        };
    } else if (!code) {
        errorBody = {
            error: 'invalid_request',
            error_description: `Missing required parameter: code`,
        };
    } else if (!clientId) {
        errorBody = {
            error: 'invalid_request',
            error_description: 'Could not determine client ID from request.',
        };
    } else if (!clientSecret) {
        errorBody = {
            error: 'invalid_request',
            error_description: 'client_secret is missing.',
        };
    } else if (expectedClientId !== clientId) {
        errorBody = {
            error: 'invalid_client',
            error_description: 'The OAuth client was not found.',
        };
    } else if (expectedClientSecret !== clientSecret) {
        errorBody = {
            error: 'invalid_client',
            error_description: 'Unauthorized',
        };
    }

    if (errorBody) {
        return reply.status(StatusCodes.BAD_REQUEST).send(errorBody);
    }

    const givenName = faker.name.firstName();
    const familyName = faker.name.lastName();

    const authorizationCodeInfo = {
        email: faker.internet.email(givenName, familyName, 'gmail.com'),
        email_verified: true,
        name: `${givenName} ${familyName}`,
        picture: faker.image.imageUrl(),
        given_name: givenName,
        family_name: familyName,
        locale: _.sample(['en', 'pl']) as string,
        sub: getRandomNumericString(21),
    };

    const idToken = JWT.sign(
        authorizationCodeInfo,
        {
            key: keyPair.privateKey,
            passphrase: 'secret',
        },
        {
            algorithm: 'RS256',
            expiresIn: '1h',
        },
    );

    return {
        access_token: getRandomString(164),
        id_token: idToken,
        expires_in: 3599,
        token_type: 'Bearer',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
    };
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
