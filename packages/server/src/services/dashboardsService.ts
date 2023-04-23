import _ from 'lodash';

import { Dashboard, DashboardDto } from '../entities/dashboardEntity';
import { createDashboardsRepository } from '../repositories/dashboardsRepository';
import type { GenericService } from './genericService';

export interface DashboardsService extends GenericService<Dashboard, DashboardDto> {}

export const createDashboardsService = (): DashboardsService => {
    const repository = createDashboardsRepository();

    const create: DashboardsService['create'] = (dto) => {
        const dashboard = repository.create(dto);

        return repository.saveAndFind(dashboard);
    };

    const findByIdOrFail: DashboardsService['findByIdOrFail'] = (_id) => {
        return repository.findOneOrFail({
            where: { _id },
        });
    };

    const search: DashboardsService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: DashboardsService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const update: DashboardsService['update'] = async (dashboard, updatedDashboard) => {
        const newDashboard = repository.merge(repository.create(dashboard), updatedDashboard);

        if (_.isEqual(dashboard, newDashboard)) {
            return dashboard;
        }

        return repository.saveAndFind(newDashboard);
    };

    return {
        create,
        findByIdOrFail,
        search,
        searchAndCount,
        update,
    };
};
