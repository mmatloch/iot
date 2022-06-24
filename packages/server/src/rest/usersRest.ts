import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import { userSchema } from '../entities/userEntity';
import { createUsersService } from '../services/usersService';

const tokenDtoSchema = Type.Object(
    {
        authorizationCode: Type.String(),
    },
    {
        additionalProperties: false,
    },
);

const tokenSchema = Type.Object(
    {
        token: Type.String(),
        expiresIn: Type.Number(),
        tokenType: Type.String(),
    },
    {
        additionalProperties: false,
    },
);

const createTokenSchema = {
    body: tokenDtoSchema,
    response: {
        [StatusCodes.CREATED]: tokenSchema,
    },
};

const searchUsersSchema = {
    querystring: Type.Object({
        email: Type.Optional(Type.String({ format: 'email' })),
    }),
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(userSchema),
    },
};

export const createUsersRest: ApplicationPlugin = async (app) => {
    app.withTypeProvider().post('/users/token', { schema: createTokenSchema }, async (request, reply) => {
        const service = createUsersService();

        const token = await service.createToken(request.body);
        return reply.status(StatusCodes.CREATED).send(token);
    });

    app.withTypeProvider().get('/users', { schema: searchUsersSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.assert({});

        const service = createUsersService();

        const token = await service.search(request.query);
        return reply.status(StatusCodes.OK).send(token);
    });
};
