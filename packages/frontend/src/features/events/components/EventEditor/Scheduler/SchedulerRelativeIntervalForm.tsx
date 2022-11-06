import SchedulerIntervalForm from './SchedulerIntervalForm';
import SchedulerRunAfterEventForm from './SchedulerRunAfterEventForm';

export default function SchedulerRelativeIntervalForm() {
    return (
        <>
            <SchedulerRunAfterEventForm />
            <SchedulerIntervalForm />
        </>
    );
}
