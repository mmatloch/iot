import { fs } from 'zx';

export const ROOT_PACKAGE_JSON_PATH = './package.json';
export const DOCKER_COMPOSE_PATH = './packages/deploy/docker-compose.yml';

const rootPackageJson = fs.readJsonSync(ROOT_PACKAGE_JSON_PATH);
export const PROJECT_NAME = rootPackageJson.name;
