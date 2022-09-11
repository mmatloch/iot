import { join } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { cyan, green, yellow } from 'chalk';
import { x } from 'qqjs';

import { ALL_APPS_TO_BUILD, APP_SEPARATOR, PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    nodeEnv: string;
    production: boolean;
    imageTag: string;
    imageRepo: string;
    ci: string;
    apps: string;
    platforms: string;
    push: boolean;
}

const createDockerImages = (flags: Flags) => [
    {
        name: 'server',
        dockerfilePath: flags.production
            ? join(PATH.Packages, 'server', 'Dockerfile')
            : join(PATH.Packages, 'server', 'Dockerfile.dev'),
        imageName: `${flags.imageRepo}/${PROJECT_NAME}-server`,
        imageTag: flags.imageTag,
        buildArgs: [
            {
                key: 'NODE_ENV',
                value: flags.nodeEnv,
            },
        ],
        buildCondition: () => true,
    },
    {
        name: 'frontend',
        dockerfilePath: flags.production
            ? join(PATH.Packages, 'frontend', 'Dockerfile')
            : join(PATH.Packages, 'frontend', 'Dockerfile.dev'),
        imageName: `${flags.imageRepo}/${PROJECT_NAME}-frontend`,
        imageTag: flags.imageTag,
        buildCondition: () => true,
    },
    {
        name: 'stubs',
        dockerfilePath: join(PATH.Packages, 'stubs', 'Dockerfile'),
        imageName: `${PROJECT_NAME}-stubs`,
        imageTag: 'latest',
        buildArgs: [
            {
                key: 'NODE_ENV',
                value: flags.nodeEnv,
            },
        ],
        buildCondition: () => flags.ci || !flags.production,
    },
    {
        name: 'tests',
        dockerfilePath: join(PATH.Packages, 'tests', 'Dockerfile'),
        imageName: `${PROJECT_NAME}-tests`,
        imageTag: 'latest',
        buildCondition: () => flags.ci || !flags.production,
    },
];

export class BuildCommand extends Command {
    static description = 'Build Docker images';

    static flags = {
        nodeEnv: Flags.string({
            required: true,
            default: 'production',
            options: ['development', 'production'],
        }),
        production: Flags.boolean({
            required: true,
            default: true,
            allowNo: true,
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
        platforms: Flags.string({
            required: true,
            default: 'linux/amd64',
            env: 'PLATFORMS',
        }),
        ci: Flags.string({
            required: true,
            default: '',
            env: 'CI',
        }),
        apps: Flags.string({
            required: true,
            default: ALL_APPS_TO_BUILD.join(APP_SEPARATOR),
            env: 'APPS',
        }),
        push: Flags.boolean({
            required: true,
            default: false,
        }),
    };

    async run() {
        const { flags } = await this.parse(BuildCommand);

        const dockerImages = createDockerImages(flags);

        const appsToBuild = flags.apps.split(APP_SEPARATOR);

        for (const { name, buildCondition, buildArgs, dockerfilePath, imageName, imageTag } of dockerImages) {
            if (!appsToBuild.includes(name)) {
                this.log(yellow(`Skipping '${name}'`));
                continue;
            }

            if (!buildCondition?.()) {
                this.log(yellow(`Skipping '${name}'`));
                continue;
            }

            this.log(cyan(`Building '${name}' (${imageName}:${imageTag}) Docker image`));

            const buildArg = buildArgs?.flatMap(({ key, value }) => ['--build-arg', `${key}=${value}`]).join(' ') || '';

            const buildFlags = [`-f ${dockerfilePath}`, `-t ${imageName}:${imageTag}`, `--platform=${flags.platforms}`];

            if (flags.push) {
                buildFlags.push('--push');
            }

            await x(`docker build ${buildFlags.join(' ')} ${buildArg} ${PATH.Root}`);
            this.log(green(`Successfully built '${name}' (${imageName}:${imageTag}) Docker image`));
        }
    }
}
