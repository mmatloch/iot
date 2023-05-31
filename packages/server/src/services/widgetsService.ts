import _, { get, isNumber } from 'lodash';
import { In } from 'typeorm';

import { Device } from '../entities/deviceEntity';
import { Event } from '../entities/eventEntity';
import { Widget, WidgetDto } from '../entities/widgetEntity';
import { createWidgetsRepository } from '../repositories/widgetsRepository';
import { createDevicesService } from './devicesService';
import { createEventsService } from './eventsService';
import type { GenericService } from './genericService';

export interface WidgetsService extends GenericService<Widget, WidgetDto> {
    getPreview: (dto: WidgetDto) => Promise<Widget>;
    hardDelete: (widget: Widget) => Promise<void>;
}

const TEXT_LINE_REGEX = /{{(.+?)}}/g;

export const createWidgetsService = (): WidgetsService => {
    const repository = createWidgetsRepository();
    const devicesService = createDevicesService();
    const eventsService = createEventsService();

    const create: WidgetsService['create'] = (dto) => {
        const widget = repository.create(dto);

        return repository.saveAndFind(widget);
    };

    const findByIdOrFail: WidgetsService['findByIdOrFail'] = async (_id) => {
        const widget = await repository.findOneOrFail({
            where: { _id },
        });

        return widget;
    };

    const search: WidgetsService['search'] = async (query) => {
        const widgets = await repository.find(query);

        await parseTextLines(widgets);

        return widgets;
    };

    const searchAndCount: WidgetsService['searchAndCount'] = async (query) => {
        const result = await repository.findAndCount(query);

        await parseTextLines(result[0]);

        return result;
    };

    const update: WidgetsService['update'] = async (widget, updatedWidget) => {
        const newWidget = repository.merge(repository.create(widget), updatedWidget);

        if (_.isEqual(widget, newWidget)) {
            return widget;
        }

        return repository.saveAndFind(newWidget);
    };

    const parseTextLine = (textLine: WidgetDto['textLines'][0], context: unknown) => {
        return textLine.value.replace(TEXT_LINE_REGEX, (_match, propertyName) => {
            return get(context, propertyName, 'UNKNOWN');
        });
    };

    const parseTextLines = async (widgets: Widget[] | WidgetDto[]) => {
        const deviceIds = widgets
            .map((widget) => widget.textLines.map((textLine) => textLine.deviceId))
            .flat()
            .filter(isNumber);

        const eventIds = widgets
            .map((widget) => widget.textLines.map((textLine) => textLine.eventId))
            .flat()
            .filter(isNumber);

        const devices = await devicesService.search({
            where: {
                _id: In(deviceIds),
            },
        });

        const events = await eventsService.search({
            where: {
                _id: In(eventIds),
            },
        });

        const getTextLineContext = (textLine: WidgetDto['textLines'][0]): Device | Event | Record<string, unknown> => {
            if (textLine.deviceId) {
                return devices.find((device) => device._id === textLine.deviceId) || {};
            }

            if (textLine.eventId) {
                return events.find((events) => events._id === textLine.eventId) || {};
            }

            return {};
        };

        widgets.forEach((widget) => {
            widget.textLines.forEach((textLine) => {
                const context = getTextLineContext(textLine);

                textLine.value = parseTextLine(textLine, context);
            });
        });
    };

    const hardDelete: WidgetsService['hardDelete'] = async (widget) => {
        await repository.delete({
            _id: widget._id,
        });
    };

    const getPreview: WidgetsService['getPreview'] = async (dto) => {
        const now = new Date().toISOString();

        await parseTextLines([dto]);

        return repository.create({
            ...dto,
            _id: 1,
            _version: 1,
            _createdAt: now,
            _createdBy: null,
            _createdByUser: null,
            _updatedAt: now,
            _updatedBy: null,
            _updatedByUser: null,
        });
    };

    return {
        create,
        findByIdOrFail,
        search,
        searchAndCount,
        update,
        getPreview,
        hardDelete,
    };
};
