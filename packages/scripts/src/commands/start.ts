import { EOL } from 'node:os';

import { Command, Flags } from '@oclif/core';
import { cyan } from 'chalk';
import { readFileSync, writeFileSync } from 'fs-extra';
import _ from 'lodash';
import { x } from 'qqjs';

import {
    ALL_APPS_TO_START,
    APP_SEPARATOR,
    DEFAULT_APPS,
    PATH,
    PRODUCTION_APPS,
    PROJECT_NAME,
} from '../utils/constants';

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
            default: '',
            env: 'CI',
        }),
        pull: Flags.boolean({
            required: false,
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
        const { flags } = await this.parse(StartCommand);

        const isCiOrLocal = flags.ci || flags.env === 'local';

        let filePath;

        if (isCiOrLocal) {
            filePath = PATH.DeployLocal.DockerCompose;
            this.generateLocalEnv(flags.imageRepo, flags.imageTag);
        } else {
            filePath = PATH.DeployProd.DockerCompose;
        }

        // pull only when a flag is used or the env is other than local/CI
        const shouldPull = _.isUndefined(flags.pull) ? !isCiOrLocal : flags.pull;

        if (shouldPull) {
            await x(`docker compose -p ${PROJECT_NAME} -f ${filePath} pull ${PRODUCTION_APPS.join(' ')}`);
        }

        const forbiddenApps = ['tests'];
        let appsToStart: string[] = [];

        if (!flags.apps.length) {
            appsToStart = isCiOrLocal ? ALL_APPS_TO_START : PRODUCTION_APPS;
        } else {
            appsToStart = flags.apps.split(APP_SEPARATOR).filter((app) => !forbiddenApps.includes(app));
        }

        await x(`docker compose -p ${PROJECT_NAME} -f ${filePath} up -d ${appsToStart.concat(DEFAULT_APPS).join(' ')}`);
    }
}
