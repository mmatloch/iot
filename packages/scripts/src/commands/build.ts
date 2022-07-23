import { join } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { cyan, green, yellow } from 'chalk';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME } from '../utils/constants';

interface Flags {
    nodeEnv: string;
    onlyServer: boolean;
    ci: string;
}

const createDockerImages = (flags: Flags) => [
    {
        name: 'Server',
        dockerfilePath: join(PATH.Packages, 'server', 'Dockerfile'),
        imageName: `${PROJECT_NAME}/server`,
        imageTag: 'latest',
        buildArgs: [
            {
                key: 'NODE_ENV',
                value: flags.nodeEnv,
            },
        ],
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
        buildCondition: () => flags.ci || !flags.onlyServer,
    },
    {
        name: 'Tests',
        dockerfilePath: join(PATH.Packages, 'tests', 'Dockerfile'),
        imageName: `${PROJECT_NAME}/tests`,
        imageTag: 'latest',
        buildCondition: () => flags.ci || !flags.onlyServer,
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
        onlyServer: Flags.boolean({
            required: true,
            default: true,
        }),
        ci: Flags.string({
            required: true,
            default: '',
            env: 'CI',
        }),
    };

    async run() {
        const { flags } = await this.parse<Flags, Record<string, unknown>>(BuildCommand);
        console.log(flags);

        for (const { name, buildCondition, buildArgs, dockerfilePath, imageName, imageTag } of createDockerImages(
            flags,
        )) {
            if (!buildCondition?.()) {
                this.log(yellow(`Skipping '${name}'`));
                continue;
            }

            this.log(cyan(`Building '${name}' Docker image`));

            const buildArg = buildArgs?.flatMap(({ key, value }) => ['--build-arg', `${key}=${value}`]).join(' ') || '';

            await x(`docker build -f ${dockerfilePath} -t ${imageName}:${imageTag} ${buildArg} ${PATH.Root}`);
            this.log(green(`Successfully built '${name}' Docker image`));
        }
    }
}
