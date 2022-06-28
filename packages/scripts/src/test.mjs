import { $ } from 'zx';

import { DOCKER_COMPOSE_PATH, PROJECT_NAME } from './utils/constants.mjs';
import { parseInput, serializeParams } from './utils/params.mjs';

const main = async () => {
    const { params } = parseInput();

    const composeArgs = [`-p`, PROJECT_NAME, `-f`, DOCKER_COMPOSE_PATH];
    const runArgs = [];

    if (params['watchAll']) {
        runArgs.push('-it');
    }

    await $`docker compose ${composeArgs} run ${runArgs} tests ${serializeParams(params)}`.stdio(
        'inherit',
        'inherit',
        'inherit',
    );
};

await main();
