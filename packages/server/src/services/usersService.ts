import { User } from '../entities/userEntity';
import { createUsersRepository } from '../repositories/usersRepository';
import { createGoogleOAuth2Service } from './googleOAuth2Service';

interface UserDto {
    authorizationCode: string;
}

export const createUsersService = () => {
    const create = async (userDto: UserDto): Promise<User> => {
        const googleOAuth2Service = createGoogleOAuth2Service();
        const userInfo = await googleOAuth2Service.getUserInfo(userDto.authorizationCode);

        const repository = createUsersRepository();
        const user = repository.create(userInfo);

        return repository.save(user);
    };

    return {
        create,
    };
};
