import { EventMetadataOnMultipleInstances, EventSchedulerTask } from '../eventDefinitions';

const createEventSchedulerTaskManager = () => {
    let taskList: EventSchedulerTask[] = [];

    const add = (
        taskDto: Pick<EventSchedulerTask, 'eventId' | 'runAt'>,
        onConflict: EventMetadataOnMultipleInstances,
    ) => {
        if (onConflict) {
            const tasks = searchByEventId(taskDto.eventId);

            if (tasks.length) {
                switch (onConflict) {
                    case EventMetadataOnMultipleInstances.Skip:
                        return;

                    case EventMetadataOnMultipleInstances.Replace:
                        removeByEventId(taskDto.eventId);
                        break;

                    case EventMetadataOnMultipleInstances.Create:
                    default:
                        break;
                }
            }
        }

        const task = {
            ...taskDto,
            _id: taskList.length + 1,
        };

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
        return search((task) => task.eventId === eventId);
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
        search,
    };
};

const taskManager = createEventSchedulerTaskManager();

export const getEventSchedulerTaskManager = () => taskManager;
