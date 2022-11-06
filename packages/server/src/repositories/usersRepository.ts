import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { User } from '../entities/userEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createUsersRepository = () => {
    return timescaleDataSource.getRepository(User).extend(getRepositoryExtension<User>());
};
