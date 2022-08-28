import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { PROJECT_NAME } from '../utils/constants';

interface Flags {
    imageTag: string;
    imageRepo: string;
}

interface Args {
    appName: string;
}

export default class PushImageCommand extends Command {
    static description = 'Build Docker images';

    static flags = {
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
    };

    static args = [
        {
            name: 'appName',
            required: true,
            description: 'the name of the application to push',
        },
    ];

    async run(): Promise<void> {
        const { args, flags } = await this.parse<Flags, Args>(PushImageCommand);

        const image = `${flags.imageRepo}/${PROJECT_NAME}-${args.appName}:${flags.imageTag}`;

        await x(`docker image push ${image}`);
    }
}
