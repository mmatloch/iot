import { join } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { cyan, green, yellow } from 'chalk';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    nodeEnv: string;
    production: boolean;
    ci: string;
}

const isDevelopment = (nodeEnv: string) => nodeEnv === 'development';

const createDockerImages = (flags: Flags) => [
    {
        name: 'Server',
        dockerfilePath: join(PATH.Packages, 'server', 'Dockerfile'),
        imageName: `${PROJECT_NAME}/server`,
        imageTag: isDevelopment(flags.nodeEnv) ? 'local' : 'latest',
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
        imageName: `${PROJECT_NAME}/frontend`,
        imageTag: isDevelopment(flags.nodeEnv) ? 'local' : 'latest',
        buildCondition: () => true,
    },
    {
        name: 'Google services stub',
        dockerfilePath: join(PATH.Packages, 'google-stub', 'Dockerfile'),
        imageName: `${PROJECT_NAME}/google-stub`,
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
        imageName: `${PROJECT_NAME}/tests`,
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
        ci: Flags.string({
            required: true,
            default: '',
            env: 'CI',
        }),
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(BuildCommand);

        for (const { name, buildCondition, buildArgs, dockerfilePath, imageName, imageTag } of createDockerImages(
            flags,
        )) {
            if (!buildCondition?.()) {
                this.log(yellow(`Skipping '${name}'`));
                continue;
            }

            this.log(cyan(`Building '${name}' (${imageName}:${imageTag}) Docker image`));

            const buildArg = buildArgs?.flatMap(({ key, value }) => ['--build-arg', `${key}=${value}`]).join(' ') || '';

            await x(`docker build -f ${dockerfilePath} -t ${imageName}:${imageTag} ${buildArg} ${PATH.Root}`);
            this.log(green(`Successfully built '${name}' (${imageName}:${imageTag}) Docker image`));
        }
    }
}
