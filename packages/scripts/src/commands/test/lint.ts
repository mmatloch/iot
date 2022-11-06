import { Command } from '@oclif/core';
import { green } from 'chalk';
import { x } from 'qqjs';

export class TestLintCommand extends Command {
    static description = 'Run lint';

    async run() {
        this.log(green('Running ESLint'));
        await x(`yarn workspace iot run eslint .`);
    }
}
