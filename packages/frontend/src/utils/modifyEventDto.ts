import type { EventDto } from '@definitions/entities/eventTypes';
import { EventMetadataTaskType, EventTriggerType } from '@definitions/entities/eventTypes';
import { cloneDeep } from 'lodash';

const isRelative = (dto: EventDto) =>
    dto.metadata?.taskType === EventMetadataTaskType.RelativeCron ||
    dto.metadata?.taskType === EventMetadataTaskType.RelativeInterval;

const isInterval = (dto: EventDto) =>
    dto.metadata?.taskType === EventMetadataTaskType.StaticInterval ||
    dto.metadata?.taskType === EventMetadataTaskType.RelativeInterval;

const isCron = (dto: EventDto) =>
    dto.metadata?.taskType === EventMetadataTaskType.StaticCron ||
    dto.metadata?.taskType === EventMetadataTaskType.RelativeCron;

export const prepareEventDto = (orginalDto: EventDto): EventDto => {
    const dto = cloneDeep(orginalDto);

    if (dto.triggerType !== EventTriggerType.Scheduler) {
        dto.metadata = null;
    }

    if (dto.metadata) {
        if (!isInterval(dto)) {
            // @ts-expect-error this field doesn't exist in the interface
            delete dto.metadata.interval;
        }

        if (!isRelative(dto)) {
            // @ts-expect-error this field doesn't exist in the interface
            delete dto.metadata.runAfterEvent;
        }

        if (!isCron(dto)) {
            // @ts-expect-error this field doesn't exist in the interface
            delete dto.metadata.cronExpression;
        }
    }

    return dto;
};
