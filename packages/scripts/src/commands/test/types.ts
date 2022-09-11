import { Command } from '@oclif/core';
import { green } from 'chalk';
import { x } from 'qqjs';

export class TestTypesCommand extends Command {
    static description = 'Run type checks';

    async run() {
        this.log(green(`Type checking 'server'`));
        await x(`yarn workspace server run type-check`);

        this.log(green(`Type checking 'stubs'`));
        await x(`yarn workspace stubs run type-check`);
    }
}
