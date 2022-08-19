import { EventMetadataOnMultipleInstances, EventSchedulerTask } from '../eventDefinitions';

export const createEventSchedulerTaskManager = () => {
    let taskList: EventSchedulerTask[] = [];

    const add = (task: EventSchedulerTask, onConflict: EventMetadataOnMultipleInstances) => {
        if (onConflict) {
            const tasks = searchByEventId(task.eventId);

            if (tasks.length) {
                switch (onConflict) {
                    case EventMetadataOnMultipleInstances.Skip:
                        return;

                    case EventMetadataOnMultipleInstances.Replace:
                        removeByEventId(task.eventId);
                        break;

                    case EventMetadataOnMultipleInstances.Create:
                    default:
                        break;
                }
            }
        }

        taskList.push(task);
    };

    const remove = (taskToRemove: EventSchedulerTask) => {
        taskList = taskList.filter((task) => task !== taskToRemove);
    };

    const removeByEventId = (eventId: number) => {
        taskList = taskList.filter((task) => task.eventId !== eventId);
    };

    const search = (predicate: (task: EventSchedulerTask) => unknown) => {
        return taskList.filter(predicate);
    };

    const searchByEventId = (eventId: number) => {
        return search((task) => task.eventId <= eventId);
    };

    const searchBeforeDate = (runAt: Date) => {
        return search((task) => task.runAt <= runAt);
    };

    const getTaskCount = () => {
        return taskList.length;
    };

    return {
        add,
        remove,
        removeByEventId,
        searchBeforeDate,
        getTaskCount,
    };
};
