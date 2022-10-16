import { EventDto } from '@definitions/entities/eventTypes';
import { UseFormReturn } from 'react-hook-form';

import SchedulerCronExpressionForm from './SchedulerCronExpressionForm';
import SchedulerRunAfterEventForm from './SchedulerRunAfterEventForm';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function SchedulerRelativeCronForm({ methods }: Props) {
    return (
        <>
            <SchedulerRunAfterEventForm methods={methods} />
            <SchedulerCronExpressionForm methods={methods} />
        </>
    );
}
