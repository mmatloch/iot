import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';
import { QueryFailedError } from 'typeorm';

import { userSchema } from '../entities/userEntity';
import { Errors } from '../errors';
import { createUsersService } from '../services/usersService';

const userDtoSchema = Type.Object(
    {
        authorizationCode: Type.String(),
    },
    {
        additionalProperties: false,
    },
);

const createUserSchema = {
    body: userDtoSchema,
    response: {
        [StatusCodes.CREATED]: userSchema,
    },
};

export const createUsersRest: ApplicationPlugin = async (app) => {
    app.setErrorHandler(async (error) => {
        if (error instanceof QueryFailedError) {
            switch (error.code) {
                case '23505': {
                    throw Errors.userAlreadyExists({
                        message: error.driverError.detail,
                        cause: error,
                    });
                }
            }
        }

        throw error;
    });

    app.post('/users', { schema: createUserSchema }, async (request, reply) => {
        const service = createUsersService();

        const user = await service.create(request.body);
        return reply.status(StatusCodes.CREATED).send(user);
    });
};
