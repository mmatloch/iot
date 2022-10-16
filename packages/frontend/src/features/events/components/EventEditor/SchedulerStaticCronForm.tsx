import { EventDto } from '@definitions/entities/eventTypes';
import { UseFormReturn } from 'react-hook-form';

import SchedulerCronExpressionForm from './SchedulerCronExpressionForm';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function SchedulerStaticCronForm({ methods }: Props) {
    return <SchedulerCronExpressionForm methods={methods} />;
}
