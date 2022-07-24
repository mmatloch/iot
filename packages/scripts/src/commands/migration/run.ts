import { Command } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME, TYPEORM } from '../../utils/constants';

export class MigrationRunCommand extends Command {
    static description = 'Run migrations';

    async run() {
        const cmd = `${TYPEORM.CliCommand} -d ${TYPEORM.DataSourcePath} migration:run`;

        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} exec server ${cmd}`);
    }
}
