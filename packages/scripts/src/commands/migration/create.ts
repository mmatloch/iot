import { userInfo } from 'os';
import { join } from 'path';

import { Args, Command } from '@oclif/core';
import _ from 'lodash';
import { x } from 'qqjs';

import { PATH, PROJECT_NAME, TYPEORM } from '../../utils/constants';

interface Args {
    migrationName: string;
}

export class MigrationCreateCommand extends Command {
    static description = 'Create a new migration';

    static args = {
        migrationName: Args.string({ required: true, description: 'the name of the migration' }),
    };

    async run() {
        const { args } = await this.parse(MigrationCreateCommand);

        const cmd = `${TYPEORM.CliCommand} migration:create ${join(
            TYPEORM.MigrationsPath,
            _.upperFirst(_.camelCase(args.migrationName)),
        )}`;

        await x(`docker compose -p ${PROJECT_NAME} -f ${PATH.DeployLocal.DockerCompose} exec server ${cmd}`);

        // Change ownership
        const { uid, gid } = userInfo();
        await x(`sudo chown -R ${uid}:${gid} ${PATH.Server.Migrations}`);
    }
}
