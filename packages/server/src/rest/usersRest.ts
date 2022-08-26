import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { AccessControlSubject, createAccessControl } from '../accessControl';
import {
    RestSearchOptions,
    SortValue,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import { User, UserDto, UserRole, userDtoSchema, userSchema } from '../entities/userEntity';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
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

const getSocialLoginSchema = {
    response: {
        [StatusCodes.OK]: Type.Object({
            google: Type.Object({
                authenticationUrl: Type.String(),
            }),
        }),
    },
};

const partialUserDtoSchema = Type.Partial(userDtoSchema, {
    additionalProperties: false,
});

const searchUsersSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(userSchema),
    },
};

const searchOptions: RestSearchOptions<User> = {
    size: {
        default: 10,
    },
    sort: {
        allowedFields: ['_createdAt', '_updatedAt'],
        default: {
            _updatedAt: SortValue.Desc,
        },
    },
    filters: {
        allowedFields: ['email', 'firstName', 'lastName', 'name', 'role', 'state'],
    },
};

const idOrMeSchema = Type.Union([Type.Literal('me'), Type.Integer()]);

const getUserSchema = {
    params: Type.Object({
        id: idOrMeSchema,
    }),
    response: {
        [StatusCodes.OK]: userSchema,
    },
};

const updateUserSchema = {
    params: Type.Object({
        id: idOrMeSchema,
    }),
    body: partialUserDtoSchema,
    response: {
        [StatusCodes.OK]: userSchema,
    },
};

const userUpdatableFields = ['name', 'firstName', 'lastName'];
const adminUpdatableFields = userUpdatableFields.concat(['email', 'state', 'role']);

const checkUpdatableFields = (user: Partial<UserDto>, updatableFields: string[]) => {
    Object.keys(user).forEach((key) => {
        if (!updatableFields.includes(key)) {
            throw Errors.noPermissionToUpdateField({
                detail: key,
            });
        }
    });
};

const getUserIdFromParams = (id: 'me' | number, subject: AccessControlSubject): number => {
    if (id === 'me') {
        return subject.userId;
    }

    return id;
};

export const createUsersRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'User' });

    app.withTypeProvider().post('/users/token', { schema: createTokenSchema }, async (request, reply) => {
        const service = createUsersService();

        const token = await service.createToken(request.body);
        return reply.status(StatusCodes.CREATED).send(token);
    });

    app.withTypeProvider().get('/users/socialLogin', { schema: getSocialLoginSchema }, async (request, reply) => {
        const service = createUsersService();

        const socialLogin = service.getSocialLogin();
        return reply.status(StatusCodes.OK).send(socialLogin);
    });

    app.withTypeProvider().get('/users', { schema: searchUsersSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const searchResponse = await createRestSearch(createUsersService()).query(request.query, searchOptions);

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/users/:id', { schema: getUserSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        const subject = accessControl.authorize();
        const isAdmin = accessControl.hasRole(UserRole.Admin);

        const userId = getUserIdFromParams(request.params.id, subject);

        if (!isAdmin) {
            accessControl.authorize({
                userId,
            });
        }

        const service = createUsersService();

        const user = await service.findByIdOrFail(userId);
        return reply.status(StatusCodes.OK).send(user);
    });

    app.withTypeProvider().patch('/users/:id', { schema: updateUserSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        const subject = accessControl.authorize();
        const isAdmin = accessControl.hasRole(UserRole.Admin);

        const userId = getUserIdFromParams(request.params.id, subject);

        if (!isAdmin) {
            accessControl.authorize({
                userId,
            });
        }

        const service = createUsersService();

        const user = await service.findByIdOrFail(userId);

        checkUpdatableFields(request.body, isAdmin ? adminUpdatableFields : userUpdatableFields);

        const updatedUser = await service.update(user, request.body);

        return reply.status(StatusCodes.OK).send(updatedUser);
    });
};
