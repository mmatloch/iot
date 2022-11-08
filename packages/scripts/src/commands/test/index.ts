import { Command } from '@oclif/core';

import { TestFunctionalCommand } from './functional';
import { TestIntegrationCommand } from './integration';
import { TestLintCommand } from './lint';
import { TestTypesCommand } from './types';

export class TestCommand extends Command {
    static description = 'Run all tests';

    static strict = false;

    async run() {
        await TestLintCommand.run(this.argv);
        await TestTypesCommand.run(this.argv);
        await TestFunctionalCommand.run(this.argv);
        await TestIntegrationCommand.run(this.argv);
    }
}
