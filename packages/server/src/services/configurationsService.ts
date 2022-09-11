import { Raw } from 'typeorm';

import { GenericDataPublisher } from '../bridges/generic/genericDataPublisher';
import { getZigbeeDataPublisher } from '../bridges/zigbee/zigbeeDataPublisher';
import { Configuration, ConfigurationDto, ConfigurationType } from '../entities/configurationEntity';
import { Errors } from '../errors';
import { createConfigurationsRepository } from '../repositories/configurationsRepository';
import { GenericService } from './genericService';

export interface ConfigurationsService extends GenericService<Configuration, ConfigurationDto> {
    searchByDataType: (type: ConfigurationType) => Promise<Configuration[]>;
    getBridgeDataPublisher: (configuration: Configuration) => GenericDataPublisher;
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

    const getBridgeDataPublisher: ConfigurationsService['getBridgeDataPublisher'] = (configuration) => {
        switch (configuration.data.type) {
            case ConfigurationType.ZigbeeBridge:
                return getZigbeeDataPublisher();

            default:
                throw Errors.noDataPublisherForConfiguration(configuration.data.type);
        }
    };

    return {
        create,
        search,
        searchAndCount,
        searchByDataType,
        findByIdOrFail,
        update,
        getBridgeDataPublisher,
    };
};
