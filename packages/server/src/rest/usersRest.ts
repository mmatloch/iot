import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

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

export const createUsersRest: ApplicationPlugin = async (app) => {
    app.withTypeProvider().post('/users/token', { schema: createTokenSchema }, async (request, reply) => {
        const service = createUsersService();

        const token = await service.createToken(request.body);
        return reply.status(StatusCodes.CREATED).send(token);
    });
};
