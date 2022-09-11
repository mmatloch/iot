import { EOL } from 'node:os';

import { Command, Flags } from '@oclif/core';
import { x } from 'qqjs';

import { BuildCommand } from './build';
import { StartCommand } from './start';

export default class DevCommand extends Command {
    static description = 'Build Docker images';

    static flags = {
        build: Flags.boolean({
            required: true,
            default: false,
            char: 'b',
        }),
        logs: Flags.boolean({
            required: true,
            default: true,
            char: 'l',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(DevCommand);

        await x('yarn install');

        const imageTag = 'local';

        if (flags.build) {
            await BuildCommand.run(['--no-production', '--nodeEnv', 'development', '--imageTag', imageTag]);
        }

        await StartCommand.run(['--env', 'local', '--imageTag', imageTag]);

        if (flags.logs) {
            await x(`docker logs iot-server-1 -f`);
        }
    }
}
