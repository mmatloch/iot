import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    env: string;
}

export class StartCommand extends Command {
    static description = 'Start selected environment';

    static flags = {
        env: Flags.string({
            required: true,
            default: 'production',
            options: ['local', 'production'],
        }),
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(StartCommand);

        let filePath;

        if (flags.env === 'local') {
            filePath = PATH.DeployLocal.DockerCompose;
        } else {
            filePath = PATH.DeployProd.DockerCompose;
        }

        await x(`docker compose -p ${PROJECT_NAME} -f ${filePath} up -d`);
    }
}
