import { join } from 'node:path';

import { readJsonSync } from 'fs-extra';

const ROOT_PATH = '../../';
const PACKAGES_PATH = join(ROOT_PATH, 'packages');
const SCRIPTS_PATH = '.';
const DEPLOY_LOCAL_PATH = join(PACKAGES_PATH, 'deploy', 'local');
const DEPLOY_PROD_PATH = join(PACKAGES_PATH, 'deploy', 'prod');

export const PATH = {
    Root: ROOT_PATH,
    RootPackageJson: join(ROOT_PATH, 'package.json'),
    Packages: PACKAGES_PATH,
    Scripts: SCRIPTS_PATH,
    DeployLocal: {
        Root: DEPLOY_LOCAL_PATH,
        DotEnv: join(DEPLOY_LOCAL_PATH, '.env'),
        DockerCompose: join(DEPLOY_LOCAL_PATH, 'docker-compose.yml'),
    },
    DeployProd: {
        Root: DEPLOY_PROD_PATH,
        DotEnv: join(DEPLOY_PROD_PATH, '.env'),
        DockerCompose: join(DEPLOY_PROD_PATH, 'docker-compose.yml'),
    },
};

const rootPackageJson = readJsonSync(PATH.RootPackageJson);
export const PROJECT_NAME: string = rootPackageJson.name;

export const TYPEORM = {
    DataSourcePath: './src/dataSources/timescaleDataSource.ts',
    MigrationsPath: './src/migrations',
    CliCommand: 'yarn typeorm-ts-node-commonjs',
};
