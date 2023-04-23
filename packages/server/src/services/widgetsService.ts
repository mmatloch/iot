import _ from 'lodash';

import { Widget, WidgetDto } from '../entities/widgetEntity';
import { createWidgetsRepository } from '../repositories/widgetsRepository';
import type { GenericService } from './genericService';

export interface WidgetsService extends GenericService<Widget, WidgetDto> {}

export const createWidgetsService = (): WidgetsService => {
    const repository = createWidgetsRepository();

    const create: WidgetsService['create'] = (dto) => {
        const widget = repository.create(dto);

        return repository.saveAndFind(widget);
    };

    const findByIdOrFail: WidgetsService['findByIdOrFail'] = (_id) => {
        return repository.findOneOrFail({
            where: { _id },
        });
    };

    const search: WidgetsService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: WidgetsService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const update: WidgetsService['update'] = async (widget, updatedWidget) => {
        const newWidget = repository.merge(repository.create(widget), updatedWidget);

        if (_.isEqual(widget, newWidget)) {
            return widget;
        }

        return repository.saveAndFind(newWidget);
    };

    return {
        create,
        findByIdOrFail,
        search,
        searchAndCount,
        update,
    };
};
