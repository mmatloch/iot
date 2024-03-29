import { join } from 'node:path';

import { readJsonSync } from 'fs-extra';

const ROOT_PATH = '../../';
const PACKAGES_PATH = join(ROOT_PATH, 'packages');
const SERVER_PATH = join(PACKAGES_PATH, 'server');
const SCRIPTS_PATH = '.';
const DEPLOY_LOCAL_PATH = join(PACKAGES_PATH, 'deploy', 'local');
const DEPLOY_PROD_PATH = join(PACKAGES_PATH, 'deploy', 'prod');

export const PATH = {
    Root: ROOT_PATH,
    RootPackageJson: join(ROOT_PATH, 'package.json'),
    Packages: PACKAGES_PATH,
    Scripts: SCRIPTS_PATH,
    Server: {
        Root: SERVER_PATH,
        Migrations: join(SERVER_PATH, 'src', 'migrations'),
    },
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

export const DEFAULT_APPS = ['nginx', 'mosquitto', 'timescale'];
export const PRODUCTION_APPS = ['frontend', 'server'];
export const DEVELOPMENT_APPS = ['stubs', 'tests'];
export const ALL_APPS_TO_BUILD = [...PRODUCTION_APPS, ...DEVELOPMENT_APPS];
export const ALL_APPS_TO_START = [...PRODUCTION_APPS, 'stubs', 'pgadmin'];

export const APP_SEPARATOR = ',';

export const PRODUCTION_IMAGE_REPO = 'mmatloch';
