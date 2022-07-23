import { Command } from '@oclif/core';

import { FunctionalTestCommand } from './functional';
import { IntegrationTestCommand } from './integration';

export class TestCommand extends Command {
    static description = 'Run all tests';

    static strict = false;

    async run() {
        await FunctionalTestCommand.run(this.argv);
        await IntegrationTestCommand.run(this.argv);
    }
}
