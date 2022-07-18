import { performance } from 'node:perf_hooks';

import { Event } from '../entities/eventEntity';
import { EventInstance } from '../entities/eventInstanceEntity';
import { Errors } from '../errors';
import { createSandbox } from '../sandbox';
import { EventContext, EventRunnerCodeSdk } from './eventRunnerDefinitions';

const sandbox = createSandbox();

interface ProcessOptions {
    event: Event;
    context: EventContext;
    performanceMetrics: EventInstance['performanceMetrics'];
}

export const createEventProcessor = (sdk: EventRunnerCodeSdk) => {
    const runCode = (code: string, context: EventContext): Promise<unknown> => {
        return sandbox.run(`(async function(sdk, context) {${code}})`).call(undefined, sdk, context);
    };

    const runCondition = async (event: Event, context: EventContext) => {
        try {
            return await runCode(event.conditionDefinition, context);
        } catch (e) {
            throw Errors.failedToRunCondition({
                cause: e,
            });
        }
    };

    const runAction = async (event: Event, context: EventContext) => {
        try {
            await runCode(event.actionDefinition, context);
        } catch (e) {
            throw Errors.failedToRunAction({
                cause: e,
            });
        }
    };

    const process = async ({ event, context, performanceMetrics }: ProcessOptions) => {
        const runConditionStart = new Date().toISOString();
        const runConditionDurationStart = performance.now();

        const condition = await runCondition(event, context);

        performanceMetrics.steps.push({
            name: 'runCondition',
            executionStartDate: runConditionStart,
            executionEndDate: new Date().toISOString(),
            executionDuration: performance.now() - runConditionDurationStart,
        });

        if (!condition) {
            throw Errors.conditionNotMet();
        }

        const runActionStart = new Date().toISOString();
        const runActionDurationStart = performance.now();

        await runAction(event, context);

        performanceMetrics.steps.push({
            name: 'runAction',
            executionStartDate: runActionStart,
            executionEndDate: new Date().toISOString(),
            executionDuration: performance.now() - runActionDurationStart,
        });
    };

    return {
        process,
    };
};
