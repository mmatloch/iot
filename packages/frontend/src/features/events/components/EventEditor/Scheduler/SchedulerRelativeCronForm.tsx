import SchedulerCronExpressionForm from './SchedulerCronExpressionForm';
import SchedulerRunAfterEventForm from './SchedulerRunAfterEventForm';

export default function SchedulerRelativeCronForm() {
    return (
        <>
            <SchedulerRunAfterEventForm />
            <SchedulerCronExpressionForm />
        </>
    );
}
