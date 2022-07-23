import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    env: string;
    ci: boolean;
}

export class StopCommand extends Command {
    static description = 'Stop selected environment';

    static flags = {
        env: Flags.string({
            required: true,
            default: 'production',
            options: ['local', 'production'],
        }),
        ci: Flags.boolean({
            required: true,
            default: false,
            env: 'CI',
        }),
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(StopCommand);

        if (flags.ci || flags.env === 'local') {
            await x(
                `docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} down --volumes --remove-orphans`,
            );

            return;
        }

        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployProd.DockerCompose} down`);
    }
}
