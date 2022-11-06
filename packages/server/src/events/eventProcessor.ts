import { performance } from 'node:perf_hooks';

import { PerformanceMetrics } from '../definitions';
import type { Event } from '../entities/eventEntity';
import { Errors } from '../errors';
import { EventTriggerContext } from './eventRunDefinitions';
import { EventRunSdk } from './sdks/sdk';

interface ProcessOptions {
    event: Event;
    context: EventTriggerContext;
    performanceMetrics: PerformanceMetrics;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const createEventProcessor = (sdk: EventRunSdk) => {
    const runCode = (code: string, context: EventTriggerContext): Promise<unknown> => {
        const fn = new AsyncFunction('sdk', 'context', code);
        return fn.call(undefined, sdk, context);
    };

    const runCondition = async (event: Event, context: EventTriggerContext) => {
        try {
            return await runCode(event.conditionDefinition, context);
        } catch (e) {
            throw Errors.failedToRunCondition(event.displayName, {
                cause: e,
            });
        }
    };

    const runAction = async (event: Event, context: EventTriggerContext) => {
        try {
            await runCode(event.actionDefinition, context);
        } catch (e) {
            throw Errors.failedToRunAction(event.displayName, {
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
