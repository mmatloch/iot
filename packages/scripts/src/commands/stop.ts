import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

export class StopCommand extends Command {
    static description = 'Stop selected environment';

    static flags = {
        env: Flags.string({
            required: true,
            default: 'production',
            options: ['local', 'production'],
        }),
        ci: Flags.string({
            required: true,
            default: '',
            env: 'CI',
        }),
    };

    async run() {
        const { flags } = await this.parse(StopCommand);

        if (flags.ci || flags.env === 'local') {
            await x(
                `docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} down --volumes --remove-orphans`,
            );

            return;
        }

        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployProd.DockerCompose} down`);
    }
}
