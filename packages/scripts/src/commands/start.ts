import { EOL } from 'node:os';

import { Command, Flags } from '@oclif/core';
import { cyan } from 'chalk';
import { readFileSync, writeFileSync } from 'fs-extra';
import { x } from 'qqjs';

import { APPS, APP_SEPARATOR, DEFAULT_APPS, PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    env: string;
    ci: string;
    imageTag: string;
    imageRepo: string;
    apps: string;
}

export class StartCommand extends Command {
    static description = 'Start selected environment';

    static flags = {
        env: Flags.string({
            required: true,
            default: 'production',
            options: ['local', 'production'],
        }),
        imageTag: Flags.string({
            required: true,
            default: 'latest',
            env: 'IMAGE_TAG',
        }),
        imageRepo: Flags.string({
            required: true,
            default: 'iot',
            env: 'IMAGE_REPO',
        }),
        apps: Flags.string({
            required: true,
            default: '',
            env: 'APPS',
        }),
        ci: Flags.string({
            required: true,
            default: APPS.join(APP_SEPARATOR),
            env: 'CI',
        }),
    };

    private generateLocalEnv = (imageRepo: string, imageTag: string) => {
        this.log(cyan(`Generating environment files`));

        const timeZone = readFileSync('/etc/timezone', { encoding: 'utf-8' }).trim();

        const envVariables = [
            `PROJECT_NAME=${PROJECT_NAME}`,
            `IMAGE_REPO=${imageRepo}`,
            `IMAGE_TAG=${imageTag}`,
            `TZ=${timeZone}`,
        ];
        writeFileSync(PATH.DeployLocal.DotEnv, envVariables.join(EOL));
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(StartCommand);

        let filePath;

        if (flags.ci || flags.env === 'local') {
            filePath = PATH.DeployLocal.DockerCompose;
            this.generateLocalEnv(flags.imageRepo, flags.imageTag);
        } else {
            filePath = PATH.DeployProd.DockerCompose;
        }

        const appsToStart = flags.apps.split(APP_SEPARATOR).concat(DEFAULT_APPS);
        await x(`docker compose -p ${PROJECT_NAME} -f ${filePath} up -d ${appsToStart.join(' ')}`);
    }
}
