import { writeFileSync } from 'node:fs';
import { EOL } from 'node:os';

import { Command, Flags } from '@oclif/core';
import { cyan } from 'chalk';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    env: string;
    ci: boolean;
}

export class StartCommand extends Command {
    static description = 'Start selected environment';

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

    private generateLocalEnv = () => {
        this.log(cyan(`Generating environment files`));
        const envVariables = [`PROJECT_NAME=${PROJECT_NAME}`];
        writeFileSync(PATH.DeployLocal.DotEnv, envVariables.join(EOL));
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(StartCommand);

        let filePath;

        if (flags.ci || flags.env === 'local') {
            filePath = PATH.DeployLocal.DockerCompose;
            this.generateLocalEnv();
        } else {
            filePath = PATH.DeployProd.DockerCompose;
        }

        await x(`docker compose -p ${PROJECT_NAME} -f ${filePath} up -d`);
    }
}
