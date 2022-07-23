import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../../utils/constants';
import { StatusApiUrl, waitForServer } from '../../utils/httpUtils';

interface Flags {
    watchAll: boolean;
    group?: string;
}

export class FunctionalTestCommand extends Command {
    static description = 'Run functional tests';

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
        const { flags } = await this.parse<Flags, Record<string, unknown>>(FunctionalTestCommand);

        const cmd = `docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} run -it tests`;
        const args = [`--watchAll=${flags.watchAll}`, '--selectProjects=functional'];

        if (flags.group) {
            args.push(`--group=${flags.group}`);
        }

        await waitForServer(new URL(StatusApiUrl.Server));
        await waitForServer(new URL(StatusApiUrl.GoogleStub));

        await x(`${cmd} ${args.join(' ')}`);
    }
}
