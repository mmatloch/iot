import { writeFileSync } from 'node:fs';
import { EOL } from 'node:os';

import { Command, Flags } from '@oclif/core';
import { cyan } from 'chalk';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    env: string;
    ci: string;
    imageTag: string;
}

export class StartCommand extends Command {
    static description = 'Start selected environment';

    static flags = {
        imageTag: Flags.string({
            required: true,
            default: 'latest',
            options: ['local', 'latest'],
        }),
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

    private generateLocalEnv = (imageTag: string) => {
        this.log(cyan(`Generating environment files`));
        const envVariables = [`PROJECT_NAME=${PROJECT_NAME}`, `IMAGE_TAG=${imageTag}`];
        writeFileSync(PATH.DeployLocal.DotEnv, envVariables.join(EOL));
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(StartCommand);

        let filePath;

        if (flags.ci || flags.env === 'local') {
            filePath = PATH.DeployLocal.DockerCompose;
            this.generateLocalEnv(flags.imageTag);
        } else {
            filePath = PATH.DeployProd.DockerCompose;
        }

        await x(`docker compose -p ${PROJECT_NAME} -f ${filePath} up -d`);
    }
}
