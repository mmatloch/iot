import { $ } from 'zx';

import { DOCKER_COMPOSE_PATH, PROJECT_NAME } from './utils/constants.mjs';

const main = async () => {
    await $`docker compose -p ${PROJECT_NAME} -f ${DOCKER_COMPOSE_PATH} down --volumes`;
};

await main();
