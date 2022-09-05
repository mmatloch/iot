import { readFile } from 'node:fs/promises';

import { Application } from '@common/application';
import { BaseError } from '@common/errors';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createOAuth2Service } from '../services/oAuth2Service';

const createTokenSchema = {
    body: Type.Object({
        code: Type.Optional(Type.String()),
        grant_type: Type.Optional(Type.String()),
        client_id: Type.Optional(Type.String()),
        client_secret: Type.Optional(Type.String()),
    }),
};

const createAuthorizationCodeSchema = {
    body: Type.Object(
        {
            email: Type.String(),
            email_verified: Type.Boolean(),
            name: Type.String(),
            picture: Type.String(),
            given_name: Type.String(),
            family_name: Type.String(),
            locale: Type.String(),
            sub: Type.String(),
        },
        {
            additionalProperties: false,
        },
    ),
};

const selectUserSchema = {
    querystring: Type.Object({
        redirect_uri: Type.String(),
        response_type: Type.String(),
        client_id: Type.String(),
        scope: Type.String(),
    }),
};

const authSchema = {
    querystring: selectUserSchema.querystring,
    body: Type.Object({
        email: Type.String(),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
    }),
};

export const createOAuth2Rest = (app: Application) => {
    app.withTypeProvider().post('/oauth2/token', { schema: createTokenSchema }, async (request, reply) => {
        const service = createOAuth2Service();

        try {
            const token = service.createToken({
                code: request.body.code,
                grantType: request.body.grant_type,
                clientId: request.body.client_id,
                clientSecret: request.body.client_secret,
            });

            return reply.status(StatusCodes.CREATED).send(token);
        } catch (e) {
            if (e instanceof BaseError) {
                return reply.status(StatusCodes.BAD_REQUEST).send({
                    error: e.errorCode,
                    error_description: e.message,
                });
            }
        }
    });

    app.withTypeProvider().post(
        '/oauth2/authorizationCode',
        { schema: createAuthorizationCodeSchema },
        async (request, reply) => {
            const service = createOAuth2Service();

            const authorizationCode = service.createAuthorizationCode(request.body);

            return reply.status(StatusCodes.CREATED).send(authorizationCode);
        },
    );

    app.withTypeProvider().get('/oauth2/auth', { schema: selectUserSchema }, async (request, reply) => {
        const selectUserContent = await readFile('./src/selectUser.html', { encoding: 'utf-8' });

        return reply.type('text/html').send(selectUserContent);
    });

    app.withTypeProvider().post('/oauth2/auth', { schema: authSchema }, async (request, reply) => {
        const service = createOAuth2Service();

        const { redirect_uri: redirectUri, response_type: responseType, client_id: clientId, scope } = request.query;

        const redirectUrl = service.authorize({
            redirectUri,
            responseType,
            clientId,
            scope,
            ...request.body,
        });

        return reply.redirect(StatusCodes.MOVED_TEMPORARILY, redirectUrl).send();
    });
};
