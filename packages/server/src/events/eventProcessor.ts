import { performance } from 'node:perf_hooks';

import { Event } from '../entities/eventEntity';
import { EventInstance } from '../entities/eventInstanceEntity';
import { Errors } from '../errors';
import { createSandbox } from '../sandbox';
import { EventContext, EventRunnerCodeSdk } from './eventRunnerDefinitions';

const sandbox = createSandbox();

interface ProcessOptions {
    event: Event;
    sdk: EventRunnerCodeSdk;
    context: EventContext;
    performanceMetrics: EventInstance['performanceMetrics'];
}

export const createEventProcessor = () => {
    const runCode = (code: string, sdk: EventRunnerCodeSdk, context: EventContext): Promise<unknown> => {
        return sandbox.run(`(async function(sdk, context) {${code}})`).call(undefined, sdk, context);
    };

    const runCondition = async (event: Event, sdk: EventRunnerCodeSdk, context: EventContext) => {
        try {
            return await runCode(event.conditionDefinition, sdk, context);
        } catch (e) {
            throw Errors.failedToRunCondition({
                cause: e,
            });
        }
    };

    const runAction = async (event: Event, sdk: EventRunnerCodeSdk, context: EventContext) => {
        try {
            await runCode(event.actionDefinition, sdk, context);
        } catch (e) {
            throw Errors.failedToRunAction({
                cause: e,
            });
        }
    };

    const process = async ({ event, sdk, context, performanceMetrics }: ProcessOptions) => {
        const runConditionStart = new Date().toISOString();
        const runConditionDurationStart = performance.now();

        const condition = await runCondition(event, sdk, context);

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

        await runAction(event, sdk, context);

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
