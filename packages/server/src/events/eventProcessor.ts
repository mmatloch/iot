import { Event } from '../entities/eventEntity';
import { Errors } from '../errors';
import { createSandbox } from '../sandbox';
import { EventContext, EventRunnerCodeSdk } from './eventRunnerDefinitions';

const sandbox = createSandbox();

export const createEventProcessor = () => {
    const runCode = (code: string, sdk: EventRunnerCodeSdk, context: EventContext): Promise<unknown> => {
        return sandbox.run(`(async function(sdk, context) {${code}})`).call(undefined, sdk, context);
    };

    const process = async (event: Event, sdk: EventRunnerCodeSdk, context: EventContext) => {
        let condition: unknown;
        try {
            condition = await runCode(event.conditionDefinition, sdk, context);
        } catch (e) {
            throw Errors.failedToRunCondition({
                cause: e,
            });
        }

        if (!condition) {
            throw Errors.conditionNotMet();
        }

        try {
            await runCode(event.actionDefinition, sdk, context);
        } catch (e) {
            throw Errors.failedToRunAction({
                cause: e,
            });
        }
    };

    return {
        process,
    };
};
