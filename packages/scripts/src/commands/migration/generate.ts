import { userInfo } from 'os';
import { join } from 'path';

import { Command } from '@oclif/core';
import _ from 'lodash';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME, TYPEORM } from '../../utils/constants';

interface Flags {}
interface GlobalFlags {}

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
        const { args } = await this.parse<Flags, GlobalFlags, Args>(MigrationGenerateCommand);

        const cmd = `${TYPEORM.CliCommand} -d ${TYPEORM.DataSourcePath} migration:generate ${join(
            TYPEORM.MigrationsPath,
            _.upperFirst(_.camelCase(args.migrationName)),
        )}`;

        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} exec server ${cmd}`);

        // Change ownership
        const { uid, gid } = userInfo();
        await x(`sudo chown -R ${uid}:${gid} ${PATH.Server.Migrations}`);
    }
}
