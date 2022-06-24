import JWT from 'jsonwebtoken';

import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { getConfig } from '../config';
import { User, UserDto, UserRole } from '../entities/userEntity';
import { createUsersRepository } from '../repositories/usersRepository';
import { createGoogleOAuth2Service } from './googleOAuth2Service';

interface TokenDto {
    authorizationCode: string;
}

interface UsersSearchQuery {
    email?: string;
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

    const createToken = async (tokenDto: TokenDto) => {
        const googleOAuth2Service = createGoogleOAuth2Service();
        const userInfo = await googleOAuth2Service.getUserInfo(tokenDto.authorizationCode);

        let user = await findByEmail(userInfo.email);

        if (!user) {
            user = await create({
                ...userInfo,
                role: UserRole.User,
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

    const search = async (query: UsersSearchQuery): Promise<SearchResponse<User>> => {
        const [users, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            meta: {
                totalHits,
            },
            hits: users,
        });
    };

    return {
        createToken,
        search,
    };
};
