import { EventDto, EventMetadataTaskType, EventTriggerType } from '@definitions/entities/eventTypes';
import { cloneDeep } from 'lodash';

const isStatic = (dto: EventDto) =>
    dto.metadata?.taskType === EventMetadataTaskType.RelativeCron ||
    dto.metadata?.taskType === EventMetadataTaskType.RelativeInterval;

const isRelative = (dto: EventDto) =>
    dto.metadata?.taskType === EventMetadataTaskType.StaticCron ||
    dto.metadata?.taskType === EventMetadataTaskType.StaticInterval;

const isCron = (dto: EventDto) =>
    dto.metadata?.taskType === EventMetadataTaskType.StaticCron ||
    dto.metadata?.taskType === EventMetadataTaskType.RelativeCron;

export const prepareEventDto = (orginalDto: EventDto): EventDto => {
    const dto = cloneDeep(orginalDto);

    if (dto.triggerType !== EventTriggerType.Scheduler) {
        dto.metadata = null;
    }

    if (dto.metadata) {
        if (isRelative(dto)) {
            // @ts-expect-error
            delete dto.metadata.runAfterEvent;
        }

        if (isStatic(dto)) {
            // @ts-expect-error
            delete dto.metadata.interval;
        }

        if (!isCron(dto)) {
            // @ts-expect-error
            delete dto.metadata.cronExpression;
        }
    }

    return dto;
};
