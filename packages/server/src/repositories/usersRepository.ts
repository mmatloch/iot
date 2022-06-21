import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { User } from '../entities/userEntity';

export const createUsersRepository = () => {
    return timescaleDataSource.getRepository(User);
};
