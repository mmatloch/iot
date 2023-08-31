import { Errors } from '../errors';
import type { WidgetsSdk } from './sdks/sdk';

export type WidgetProcessContext = Record<string, unknown>;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const createWidgetProcessor = (sdk: WidgetsSdk) => {
    const runCode = async (code: string, context: WidgetProcessContext) => {
        try {
            const fn = new AsyncFunction('sdk', 'context', code);
            return await fn.call(undefined, sdk, context);
        } catch (e) {
            throw Errors.failedToRunWidgetCode({
                cause: e,
            });
        }
    };

    return {
        runCode,
    };
};
