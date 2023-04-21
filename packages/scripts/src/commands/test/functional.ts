import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../../utils/constants';
import { StatusApiUrl, waitForServer } from '../../utils/httpUtils';

export class TestFunctionalCommand extends Command {
    static description = 'Run functional tests';

    static flags = {
        watchAll: Flags.boolean({
            required: true,
            default: false,
        }),
        group: Flags.string({
            required: false,
        }),
        detectOpenHandles: Flags.boolean({
            required: true,
            default: false,
        }),
    };

    async run() {
        const { flags } = await this.parse(TestFunctionalCommand);

        const composeArgs: string[] = [];

        if (flags.watchAll) {
            composeArgs.push('-it');
        }

        const cmd = `docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} run ${composeArgs.join(
            ' ',
        )} tests`;
        const args = [`--watchAll=${flags.watchAll}`, '--selectProjects=functional'];

        if (flags.group) {
            args.push(`--group=${flags.group}`);
        }

        if (flags.detectOpenHandles) {
            args.push(`--detectOpenHandles`);
        }

        await waitForServer(new URL(StatusApiUrl.Server));
        await waitForServer(new URL(StatusApiUrl.Stubs));

        await x(`${cmd} ${args.join(' ')}`);
    }
}
