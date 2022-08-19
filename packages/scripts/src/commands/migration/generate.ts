import { userInfo } from 'os';
import { join, resolve } from 'path';

import { Command } from '@oclif/core';
import { cyan } from 'chalk';
import _ from 'lodash';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME, TYPEORM } from '../../utils/constants';

interface Flags {}

interface Args {
    migrationName: string;
}

export class MigrationGenerateCommand extends Command {
    static description = 'Generate migration files with schema changes you made';

    static args = [
        {
            name: 'migrationName',
            required: true,
            description: 'the name of the migration',
        },
    ];

    async run() {
        const { args } = await this.parse<Flags, Args>(MigrationGenerateCommand);

        const cmd = `${TYPEORM.CliCommand} -d ${TYPEORM.DataSourcePath} migration:generate ${join(
            TYPEORM.MigrationsPath,
            _.upperFirst(_.camelCase(args.migrationName)),
        )}`;

        const { stdout: result } = await x(
            `docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} exec server ${cmd}`,
            {
                stdio: 'pipe',
            },
        );

        this.log(cyan(result));

        // Change ownership
        const filenameRegex = /\d+-\w+.ts/;
        const [filename] = result.match(filenameRegex);

        const filePath = resolve(PATH.Server.Migrations, filename);

        const { uid, gid } = userInfo();
        await x(`sudo chown ${uid}:${gid} ${filePath}`);
    }
}
