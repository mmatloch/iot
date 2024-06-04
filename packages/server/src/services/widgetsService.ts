import _, { cloneDeep, get, isNumber } from 'lodash';
import { FindManyOptions, In } from 'typeorm';

import { Device } from '../entities/deviceEntity';
import { Event } from '../entities/eventEntity';
import { SensorData } from '../entities/sensorDataEntity';
import { Widget, WidgetActionDto, WidgetActionEntry, WidgetDto, WidgetWithActionState } from '../entities/widgetEntity';
import { Errors } from '../errors';
import { eventTriggerInNewContext } from '../events/eventTriggerInNewContext';
import { createWidgetsRepository } from '../repositories/widgetsRepository';
import { parseWidgetText } from '../utils/widgetTextParser';
import { createWidgetsSdk } from '../widgets/sdks/sdk';
import { WidgetProcessContext, createWidgetProcessor } from '../widgets/widgetProcessor';
import { createDevicesService } from './devicesService';
import { createEventsService } from './eventsService';
import type { GenericService } from './genericService';
import { createSensorDataService } from './sensorDataService';

export interface WidgetsService
    extends Omit<GenericService<WidgetWithActionState, WidgetDto>, 'search' | 'searchAndCount'> {
    search: (query: FindManyOptions<Widget>) => Promise<WidgetWithActionState[]>;
    searchAndCount: (query: FindManyOptions<Widget>) => Promise<[WidgetWithActionState[], number]>;
    getPreview: (dto: WidgetDto) => Promise<WidgetWithActionState>;
    hardDelete: (widget: WidgetWithActionState) => Promise<void>;
    triggerAction: (widget: WidgetWithActionState, dto: WidgetActionDto) => Promise<void>;
}

export const createWidgetsService = (): WidgetsService => {
    const repository = createWidgetsRepository();
    const devicesService = createDevicesService();
    const sensorDataService = createSensorDataService();
    const eventsService = createEventsService();

    const create: WidgetsService['create'] = async (dto) => {
        if (dto.action) {
            if (dto.action.on.eventId < 1 || dto.action.off.eventId < 1) {
                throw Errors.invalidWidgetAction({ message: 'EventId must be defined' });
            }
        }

        const widget = repository.create(dto);

        return addActionState(await repository.saveAndFind(widget));
    };

    const findByIdOrFail: WidgetsService['findByIdOrFail'] = async (_id) => {
        const widget = await repository.findOneOrFail({
            where: { _id },
        });

        return addActionState(widget);
    };

    const search: WidgetsService['search'] = async (query) => {
        const widgets = await repository.find(query);

        await parseTextLines(widgets);
        return Promise.all(widgets.map(addActionState));
    };

    const searchAndCount: WidgetsService['searchAndCount'] = async (query) => {
        const result = await repository.findAndCount(query);

        await parseTextLines(result[0]);

        return [await Promise.all(result[0].map(addActionState)), result[1]];
    };

    const update: WidgetsService['update'] = async (widget, updatedWidget) => {
        const newWidget = repository.merge(repository.create(widget), updatedWidget);

        if (_.isEqual(widget, newWidget)) {
            return widget;
        }

        return addActionState(await repository.saveAndFind(newWidget));
    };

    const parseTextLines = async (widgets: Widget[] | WidgetDto[]) => {
        const deviceIds = widgets
            .map((widget) =>
                widget.textLines
                    .filter((textLine) => textLine.deviceId && !textLine.useDeviceSensorData)
                    .map((textLine) => textLine.deviceId),
            )
            .flat()
            .filter(isNumber);

        const sensorDataDeviceIds = widgets
            .map((widget) =>
                widget.textLines
                    .filter((textLine) => textLine.deviceId && textLine.useDeviceSensorData)
                    .map((textLine) => textLine.deviceId),
            )
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

        const sensorData = await sensorDataService.getLatestForDevices(sensorDataDeviceIds);

        const events = await eventsService.search({
            where: {
                _id: In(eventIds),
            },
        });

        console.log(sensorData, sensorDataDeviceIds);

        const getTextLineContext = (
            textLine: WidgetDto['textLines'][0],
        ): Device | Event | SensorData | Record<string, unknown> => {
            if (textLine.deviceId) {
                if (textLine.useDeviceSensorData) {
                    return sensorData.find((sensorData) => sensorData.deviceId === textLine.deviceId) || {};
                }

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

                console.log(textLine.id, context);

                textLine.value = parseWidgetText(textLine.value, context);
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

        return Object.assign(
            repository.create({
                ...dto,
                _id: 1,
                _version: 1,
                _createdAt: now,
                _createdBy: null,
                _createdByUser: null,
                _updatedAt: now,
                _updatedBy: null,
                _updatedByUser: null,
            }),
            {
                actionState: null,
            },
        );
    };

    const triggerAction: WidgetsService['triggerAction'] = async (widget, dto) => {
        if (!widget.action) {
            return;
        }

        const action: WidgetActionEntry = get(widget.action, dto.type);

        if (!action) {
            throw Errors.unsupportedActionType({});
        }

        const eventsService = createEventsService();

        const event = await eventsService.findByIdOrFail(action.eventId);
        await eventTriggerInNewContext(event, JSON.parse(action.eventContext));
    };

    const addActionState = async (widget: Widget) => {
        let actionState = null;

        if (widget.action) {
            const widgetProcessor = createWidgetProcessor(createWidgetsSdk());

            const context = cloneDeep(widget) as unknown as WidgetProcessContext;
            const result = await widgetProcessor.runCode(widget.action.stateDefinition, context);

            actionState = Boolean(result);
        }

        return Object.assign(widget, {
            actionState,
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
        triggerAction,
    };
};
