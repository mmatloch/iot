import { $ } from 'zx';

import { DOCKER_COMPOSE_PATH, PROJECT_NAME } from './utils/constants.mjs';
import { serializeParams } from './utils/params.mjs';

const getArgs = (scriptParams) => {
    const composeArgs = [`-p`, PROJECT_NAME, `-f`, DOCKER_COMPOSE_PATH];
    const runArgs = [];

    if (scriptParams['watchAll']) {
        runArgs.push('-it');
    }

    return {
        composeArgs,
        runArgs,
    };
};

const runTests = ({ composeArgs, runArgs, scriptParams }) =>
    $`docker compose ${composeArgs} run ${runArgs} tests ${serializeParams(scriptParams)}`.stdio(
        'inherit',
        'inherit',
        'inherit',
    );

const main = async (scriptParams) => {
    await functional(scriptParams);
    await integration(scriptParams);
};

export const functional = async (scriptParams) => {
    await runTests({
        ...getArgs(scriptParams),
        scriptParams: {
            ...scriptParams,
            selectProjects: 'functional',
        },
    });
};

export const integration = async (scriptParams) => {
    await runTests({
        ...getArgs(scriptParams),
        scriptParams: {
            ...scriptParams,
            selectProjects: 'integration',
            runInBand: true,
        },
    });
};

export default main;
