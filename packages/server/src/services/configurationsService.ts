import { Configuration, ConfigurationDto } from '../entities/configurationEntity';
import { createConfigurationsRepository } from '../repositories/configurationsRepository';
import { GenericService } from './genericService';

export interface ConfigurationsService extends GenericService<Configuration, ConfigurationDto> {}

export const createConfigurationsService = (): ConfigurationsService => {
    const repository = createConfigurationsRepository();

    const create: ConfigurationsService['create'] = async (dto) => {
        const configuration = repository.create(dto);

        return repository.save(configuration);
    };

    const search: ConfigurationsService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: ConfigurationsService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const findByIdOrFail: ConfigurationsService['findByIdOrFail'] = async (_id) => {
        return repository.findOneByOrFail({
            _id,
        });
    };

    const update: ConfigurationsService['update'] = (configuration, updatedConfiguration) => {
        const configurationClone = repository.create(configuration);

        return repository.save(repository.merge(configurationClone, updatedConfiguration));
    };

    return {
        create,
        search,
        searchAndCount,
        findByIdOrFail,
        update,
    };
};
