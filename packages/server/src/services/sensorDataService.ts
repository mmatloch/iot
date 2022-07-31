import { createSearchResponse } from '../apis/searchApi';
import { SensorData, SensorDataDto } from '../entities/sensorDataEntity';
import { createSensorDataRepository } from '../repositories/sensorDataRepository';
import { GenericService } from './genericService';

export interface SensorDataService extends Pick<GenericService<SensorData, SensorDataDto>, 'create' | 'search'> {}

export const createSensorDataService = (): SensorDataService => {
    const repository = createSensorDataRepository();

    const create: SensorDataService['create'] = async (dto) => {
        const sensorData = repository.create(dto);

        return repository.save(sensorData);
    };

    const search: SensorDataService['search'] = async (query) => {
        const [hits, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            hits,
            meta: {
                totalHits,
            },
        });
    };

    return {
        create,
        search,
    };
};
