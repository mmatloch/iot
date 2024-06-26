import { addMilliseconds, subMilliseconds } from 'date-fns';
import { Between } from 'typeorm';

import type { EventSchedulerTask } from '../../entities/eventSchedulerTaskEntity';
import { EventSchedulerTaskState } from '../../entities/eventSchedulerTaskEntity';
import { getLogger } from '../../logger';
import { createEventSchedulerTasksService } from '../../services/eventSchedulerTasksService';
import { eventTriggerInNewContext } from '../eventTriggerInNewContext';
import { FETCH_TASKS_INTERVAL } from './eventSchedulerConstants';
import { startLoop } from './eventSchedulerUtils';

const logger = getLogger();

const getTimeoutToNextFullSecond = () => {
    const now = new Date();

    const maxMiliseconds = 1000;
    const timeout = maxMiliseconds - now.getMilliseconds();

    return timeout;
};

export const createEventSchedulerTaskProcessor = () => {
    const eventSchedulerTasksService = createEventSchedulerTasksService();
    const taskQueue = new Map<number, EventSchedulerTask>();

    const initialize = () => {
        logger.debug('Initializing event scheduler task processor');

        startLoop(processQueue, getTimeoutToNextFullSecond);

        fetchTasks();
        startLoop(fetchTasks, () => FETCH_TASKS_INTERVAL);
    };

    const processQueue = () => {
        const now = new Date().toISOString();

        taskQueue.forEach((task) => {
            if (task.nextRunAt <= now) {
                processTask(task);
            }
        });
    };

    const fetchTasks = async () => {
        logger.trace(`Fetching tasks from the database`);

        const now = new Date();

        let tasks: EventSchedulerTask[];

        try {
            tasks = await eventSchedulerTasksService.search({
                where: {
                    nextRunAt: Between(
                        subMilliseconds(now, FETCH_TASKS_INTERVAL),
                        addMilliseconds(now, FETCH_TASKS_INTERVAL),
                    ) as unknown as string,
                    state: EventSchedulerTaskState.Queued,
                },
            });
        } catch (e) {
            logger.error({
                msg: `Failed to fetch tasks`,
                err: e,
            });

            return;
        }

        tasks.forEach((task) => {
            taskQueue.set(task._id, task);
        });
    };

    const processTask = async (task: EventSchedulerTask) => {
        logger.debug({
            msg: `Processing task ${task._id}`,
            eventSchedulerTask: task,
        });

        let updatedTask: EventSchedulerTask;

        try {
            updatedTask = await eventSchedulerTasksService.update(task, {
                state: EventSchedulerTaskState.Running,
            });
        } catch (e) {
            logger.error({
                msg: `Failed to update task state to '${EventSchedulerTaskState.Running}'`,
                eventSchedulerTask: task,
                err: e,
            });

            return;
        }

        const context = {};
        await eventTriggerInNewContext(task.event, context);

        taskQueue.delete(updatedTask._id);

        try {
            await eventSchedulerTasksService.remove(updatedTask);
        } catch (e) {
            logger.error({
                msg: `Failed to remove task`,
                eventSchedulerTask: updatedTask,
                err: e,
            });
        }
    };

    return {
        initialize,
    };
};
