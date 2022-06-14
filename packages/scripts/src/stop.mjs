import { $ } from 'zx';

import { DOCKER_COMPOSE_PATH } from './utils/constants.mjs';

const main = async () => {
    await $`docker compose -f ${DOCKER_COMPOSE_PATH} down`;
};

await main();
