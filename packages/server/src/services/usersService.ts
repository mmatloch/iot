import JWT from 'jsonwebtoken';

import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { getConfig } from '../config';
import { User, UserDto, UserRole, UserState } from '../entities/userEntity';
import { Errors } from '../errors';
import { createUsersRepository } from '../repositories/usersRepository';
import { createGoogleOAuth2Service } from './googleOAuth2Service';

interface TokenDto {
    authorizationCode: string;
}

export const createUsersService = () => {
    const config = getConfig();
    const repository = createUsersRepository();

    const create = async (userDto: UserDto): Promise<User> => {
        const user = repository.create(userDto);

        return repository.save(user);
    };

    const findByEmail = async (email: string): Promise<User | null> => {
        return repository.findOneBy({ email });
    };

    const findByIdOrFail = async (_id: number): Promise<User> => {
        return repository.findOneByOrFail({ _id });
    };

    const createToken = async (tokenDto: TokenDto) => {
        const googleOAuth2Service = createGoogleOAuth2Service();
        const userInfo = await googleOAuth2Service.getUserInfo(tokenDto.authorizationCode);

        let user = await findByEmail(userInfo.email);

        if (!user) {
            let role = UserRole.User;
            let state = UserState.PendingApproval;

            if (config.authorization.rootUserEmail === userInfo.email) {
                role = UserRole.Admin;
                state = UserState.Active;
            }

            user = await create({
                ...userInfo,
                role,
                state,
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

    const search = async (query: Partial<User>): Promise<SearchResponse<User>> => {
        const [users, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            meta: {
                totalHits,
            },
            hits: users,
        });
    };

    const update = (user: User, updatedUser: Partial<User>) => {
        return repository.save(repository.merge(user, updatedUser));
    };

    return {
        createToken,
        search,
        update,
        findByIdOrFail,
    };
};
