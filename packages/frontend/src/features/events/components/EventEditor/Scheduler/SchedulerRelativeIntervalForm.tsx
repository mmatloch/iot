import { EventDto } from '@definitions/entities/eventTypes';
import { UseFormReturn } from 'react-hook-form';

import SchedulerIntervalForm from './SchedulerIntervalForm';
import SchedulerRunAfterEventForm from './SchedulerRunAfterEventForm';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function SchedulerRelativeIntervalForm({ methods }: Props) {
    return (
        <>
            <SchedulerRunAfterEventForm methods={methods} />
            <SchedulerIntervalForm methods={methods} />
        </>
    );
}
