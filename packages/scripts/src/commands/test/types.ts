import { Command } from '@oclif/core';
import { green } from 'chalk';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../../utils/constants';

export class TestTypesCommand extends Command {
    static description = 'Run type checks';

    async run() {
        const cmd = `yarn type-check`;

        this.log(green(`Type checking 'server'`));
        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} exec server ${cmd}`);

        this.log(green(`Type checking 'google_stub'`));
        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} exec google_stub ${cmd}`);
    }
}
