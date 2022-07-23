import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../../utils/constants';

interface Flags {
    watchAll: boolean;
    group?: string;
}

export class IntegrationTestCommand extends Command {
    static description = 'Run integration tests';

    static flags = {
        watchAll: Flags.boolean({
            required: true,
            default: false,
        }),

        group: Flags.string({
            required: false,
        }),
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(IntegrationTestCommand);

        const cmd = `docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} run -it tests`;
        const args = [`--watchAll=${flags.watchAll}`, '--selectProjects=integration', '--runInBand'];

        if (flags.group) {
            args.push(`--group=${flags.group}`);
        }

        await x(`${cmd} ${args.join(' ')}`);
    }
}
