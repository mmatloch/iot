import JWT from 'jsonwebtoken';

import { getConfig } from '../config';
import { User, UserDto, UserRole, UserState } from '../entities/userEntity';
import { Errors } from '../errors';
import { getLogger } from '../logger';
import { createUsersRepository } from '../repositories/usersRepository';
import { GenericService } from './genericService';
import { createGoogleOAuth2Service } from './googleOAuth2Service';

interface TokenDto {
    authorizationCode: string;
}

interface Token {
    token: string;
    expiresIn: number;
    tokenType: string;
}

interface SocialLogin {
    google: {
        authenticationUrl: string;
    };
}

export interface UsersService extends GenericService<User, UserDto> {
    findByEmail: (email: string) => Promise<User | null>;
    createToken: (tokenDto: TokenDto) => Promise<Token>;
    getSocialLogin: () => SocialLogin;
}

export const createUsersService = () => {
    const config = getConfig();
    const logger = getLogger();
    const repository = createUsersRepository();

    const create: UsersService['create'] = (userDto) => {
        const user = repository.create(userDto);

        return repository.save(user);
    };

    const findByEmail: UsersService['findByEmail'] = (email) => {
        return repository.findOneBy({ email });
    };

    const findByIdOrFail: UsersService['findByIdOrFail'] = (_id) => {
        return repository.findOneByOrFail({ _id });
    };

    const createToken: UsersService['createToken'] = async (tokenDto) => {
        const googleOAuth2Service = createGoogleOAuth2Service();
        const userInfo = await googleOAuth2Service.getUserInfo(tokenDto.authorizationCode);

        let user = await findByEmail(userInfo.email);

        if (!user) {
            let role = UserRole.User;
            let state = UserState.PendingApproval;

            if (config.authorization.rootUserEmail === userInfo.email) {
                role = UserRole.Admin;
                state = UserState.Active;

                logger.warn(`Creating the root user with the email address '${userInfo.email}'`);
            } else {
                logger.warn(`Creating a user with the email address '${userInfo.email}'`);
            }

            user = await create({
                ...userInfo,
                role,
                state,
            });
        }

        // update avatar
        if (user.avatarUrl !== userInfo.avatarUrl) {
            await update(user, {
                avatarUrl: userInfo.avatarUrl,
            });
        }

        if (user.state !== UserState.Active) {
            throw Errors.cannotCreateTokenForUser({
                detail: user.state,
            });
        }

        const jwtPayload = {
            email: user.email,
            role: user.role,
        };

        const expiresIn = 60 * 60 * 24 * 14; // 14 days

        const token = JWT.sign(jwtPayload, config.authorization.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: expiresIn,
            subject: String(user._id),
        });

        return {
            token,
            expiresIn,
            tokenType: 'JWT',
        };
    };

    const search: UsersService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: UsersService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const update: UsersService['update'] = (user, updatedUser) => {
        return repository.save(repository.merge(user, updatedUser));
    };

    const getSocialLogin: UsersService['getSocialLogin'] = () => {
        const googleOAuth2Service = createGoogleOAuth2Service();

        return {
            google: {
                authenticationUrl: googleOAuth2Service.getAuthenticationUrl(),
            },
        };
    };

    return {
        createToken,
        search,
        searchAndCount,
        update,
        findByIdOrFail,
        getSocialLogin,
    };
};
