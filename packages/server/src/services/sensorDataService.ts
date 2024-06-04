import { In } from 'typeorm';

import type { SensorData, SensorDataDto } from '../entities/sensorDataEntity';
import { createSensorDataRepository } from '../repositories/sensorDataRepository';
import type { GenericService } from './genericService';

export interface SensorDataService
    extends Pick<GenericService<SensorData, SensorDataDto>, 'create' | 'search' | 'searchAndCount'> {
    getLatestForDevices: (deviceIds: number[]) => Promise<SensorData[]>;
}

export const createSensorDataService = (): SensorDataService => {
    const repository = createSensorDataRepository();

    const create: SensorDataService['create'] = async (dto) => {
        const sensorData = repository.create(dto);

        return repository.saveAndFind(sensorData);
    };

    const search: SensorDataService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: SensorDataService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const getLatestForDevices: SensorDataService['getLatestForDevices'] = (deviceIds) => {
        if (!deviceIds.length) {
            return Promise.resolve([]);
        }

        return repository
            .createQueryBuilder()
            .where({
                deviceId: In(deviceIds),
            })
            .distinctOn(['"deviceId"'])
            .orderBy({
                '"deviceId"': 'ASC',
                '"_createdAt"': 'DESC',
            })
            .getMany();
    };

    return {
        create,
        search,
        searchAndCount,
        getLatestForDevices,
    };
};
