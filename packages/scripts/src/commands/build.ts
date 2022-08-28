import { join } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { cyan, green, yellow } from 'chalk';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    nodeEnv: string;
    production: boolean;
    imageTag: string;
    imageRepo: string;
    ci: string;
    apps: string;
    platforms: string;
}

const createDockerImages = (flags: Flags) => [
    {
        name: 'Server',
        dockerfilePath: join(PATH.Packages, 'server', 'Dockerfile'),
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
        name: 'Frontend',
        dockerfilePath: flags.production
            ? join(PATH.Packages, 'frontend', 'Dockerfile')
            : join(PATH.Packages, 'frontend', 'Dockerfile.dev'),
        imageName: `${flags.imageRepo}/${PROJECT_NAME}-frontend`,
        imageTag: flags.imageTag,
        buildCondition: () => true,
    },
    {
        name: 'Google services stub',
        dockerfilePath: join(PATH.Packages, 'google-stub', 'Dockerfile'),
        imageName: `${PROJECT_NAME}-google-stub`,
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
        name: 'Tests',
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
            default: '',
            char: 'a',
        }),
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(BuildCommand);

        const dockerImages = createDockerImages(flags);

        let appsToBuild = flags.apps
            .split(',')
            .map((v) => v.toLowerCase())
            .filter((v) => v);

        if (!appsToBuild.length) {
            appsToBuild = dockerImages.map((image) => image.name.toLowerCase());
        }

        for (const { name, buildCondition, buildArgs, dockerfilePath, imageName, imageTag } of dockerImages) {
            if (!appsToBuild.includes(name.toLowerCase())) {
                this.log(yellow(`Skipping '${name}'`));
                continue;
            }

            if (!buildCondition?.()) {
                this.log(yellow(`Skipping '${name}'`));
                continue;
            }

            this.log(cyan(`Building '${name}' (${imageName}:${imageTag}) Docker image`));

            const buildArg = buildArgs?.flatMap(({ key, value }) => ['--build-arg', `${key}=${value}`]).join(' ') || '';

            await x(
                `docker build -f ${dockerfilePath} -t ${imageName}:${imageTag} --platform=${flags.platforms} ${buildArg} ${PATH.Root}`,
            );
            this.log(green(`Successfully built '${name}' (${imageName}:${imageTag}) Docker image`));
        }
    }
}
