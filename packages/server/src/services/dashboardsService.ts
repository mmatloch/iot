import _, { sortBy } from 'lodash';
import { In } from 'typeorm';

import { Dashboard, DashboardDto, ReorderDashboardsDto } from '../entities/dashboardEntity';
import { createDashboardsRepository } from '../repositories/dashboardsRepository';
import type { GenericService } from './genericService';
import { createWidgetsService } from './widgetsService';

export interface DashboardsService extends GenericService<Dashboard, DashboardDto> {
    reorder: (dto: ReorderDashboardsDto, userId: number) => Promise<void>;
    hardDelete: (dashboard: Dashboard) => Promise<void>;
}

export const createDashboardsService = (): DashboardsService => {
    const repository = createDashboardsRepository();
    const widgetsService = createWidgetsService();

    const create: DashboardsService['create'] = (dto) => {
        const dashboard = repository.create(dto);

        return repository.saveAndFind(dashboard);
    };

    const findByIdOrFail: DashboardsService['findByIdOrFail'] = async (_id) => {
        const dashboard = await repository.findOneOrFail({
            where: { _id },
        });

        await addWidgetsToLayout([dashboard]);

        return dashboard;
    };

    const search: DashboardsService['search'] = async (query) => {
        const dashboards = await repository.find(query);

        await addWidgetsToLayout(dashboards);

        return sortBy(dashboards, 'index');
    };

    const searchAndCount: DashboardsService['searchAndCount'] = async (query) => {
        const result = await repository.findAndCount(query);

        await addWidgetsToLayout(result[0]);

        result[0] = sortBy(result[0], 'index');

        return result;
    };

    const update: DashboardsService['update'] = async (dashboard, updatedDashboard) => {
        const newDashboard = repository.merge(repository.create(dashboard), updatedDashboard);

        if (_.isEqual(dashboard, newDashboard)) {
            return dashboard;
        }

        // remove before saving to the DB
        newDashboard.layout.forEach((entry) => {
            delete entry.widget;
        });

        return repository.saveAndFind(newDashboard);
    };

    const hardDelete: DashboardsService['hardDelete'] = async (dashboard) => {
        await repository.delete({ _id: dashboard._id });
    };

    const addWidgetsToLayout = async (dashboards: Dashboard[] | DashboardDto[]) => {
        const widgetIds = dashboards.map((dashboard) => dashboard.layout.map((entry) => entry.widgetId)).flat();

        const widgets = await widgetsService.search({
            where: {
                _id: In(widgetIds),
            },
        });

        dashboards.forEach((dashboard) => {
            dashboard.layout = dashboard.layout
                .map((entry) => {
                    const widget = widgets.find((widget) => widget._id === entry.widgetId);

                    entry.widget = widget;
                    return entry;
                })
                .filter((entry) => entry.widget);
        });
    };

    const reorder: DashboardsService['reorder'] = async (dto, userId) => {
        const dashboardIds = dto.map((entry) => entry.dashboardId);

        const dashboards = await search({
            where: {
                _id: In(dashboardIds),
                userId,
            },
        });

        await Promise.all(
            dashboards.map((dashboard) => {
                const found = dto.find((entry) => entry.dashboardId === dashboard._id);

                if (!found) {
                    return;
                }

                const newIndex = found.index;

                if (dashboard.index !== found.index) {
                    return update(dashboard, {
                        index: newIndex,
                    });
                }
            }),
        );
    };

    return {
        create,
        findByIdOrFail,
        search,
        searchAndCount,
        update,
        hardDelete,
        reorder,
    };
};
