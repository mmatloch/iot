import { Raw } from 'typeorm';

import { Configuration, ConfigurationDto, ConfigurationType } from '../entities/configurationEntity';
import { createConfigurationsRepository } from '../repositories/configurationsRepository';
import { GenericService } from './genericService';

export interface ConfigurationsService extends GenericService<Configuration, ConfigurationDto> {
    searchByDataType: (type: ConfigurationType) => Promise<Configuration[]>;
}

export const createConfigurationsService = (): ConfigurationsService => {
    const repository = createConfigurationsRepository();

    const create: ConfigurationsService['create'] = async (dto) => {
        const configuration = repository.create(dto);

        return repository.save(configuration);
    };

    const search: ConfigurationsService['search'] = (query) => {
        return repository.find(query);
    };

    const searchByDataType: ConfigurationsService['searchByDataType'] = (type) => {
        return search({
            where: {
                data: Raw(() => `data->>'type' = '${type}'`),
            },
        });
    };

    const searchAndCount: ConfigurationsService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const findByIdOrFail: ConfigurationsService['findByIdOrFail'] = (_id) => {
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
        searchByDataType,
        findByIdOrFail,
        update,
    };
};
