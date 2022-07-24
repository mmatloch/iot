import { join } from 'node:path';

import { existsSync, outputFileSync, readJsonSync } from 'fs-extra';
import _ from 'lodash';

import { PATH } from './constants';

interface Step {
    data: Record<string, unknown>;
}

export interface SetupState {
    rawData: {
        steps: Record<string, Step>;
    };
    getStep: (step: string) => Step;
    getStepData: (step: string) => Step['data'];
    getStepDataEntryValue: (step: string, stepDataEntryKey: string) => unknown;
    setStepDataEntryValue: (step: string, stepDataEntryKey: string, stepDataEntryValue: unknown) => void;
}

const STATE_PATH = join(PATH.Root, '.cache', 'setupState.json');

export const createStateCacheManager = () => {
    let cache: SetupState = {
        rawData: {
            steps: {},
        },
        getStep: function (step) {
            return _.get(this.rawData.steps, step);
        },
        getStepData: function (step) {
            return _.get(this.getStep(step), 'data');
        },
        getStepDataEntryValue: function (step, stepDataEntryKey) {
            return _.get(this.getStepData(step), stepDataEntryKey);
        },
        setStepDataEntryValue: function (step, stepDataEntryKey, stepDataEntryValue) {
            _.set(this.rawData.steps, `${step}.data.${stepDataEntryKey}`, stepDataEntryValue);
        },
    };

    const exists = () => existsSync(STATE_PATH);

    const load = (useFresh: boolean) => {
        if (!useFresh && exists()) {
            cache.rawData = readJsonSync(STATE_PATH);
        }

        return cache;
    };

    const save = () => {
        outputFileSync(STATE_PATH, JSON.stringify(cache.rawData, null, 2));
    };

    return {
        load,
        save,
    };
};
