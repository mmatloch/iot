import { EventDto } from '@definitions/entities/eventTypes';
import { UseFormReturn } from 'react-hook-form';

import SchedulerIntervalForm from './SchedulerIntervalForm';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function SchedulerStaticIntervalForm({ methods }: Props) {
    return <SchedulerIntervalForm methods={methods} />;
}
