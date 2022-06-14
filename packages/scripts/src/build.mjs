import { $, argv, fs, os } from 'zx';

import { PROJECT_NAME } from './utils/constants.mjs';
import { print } from './utils/print.mjs';

const dockerImages = [
    {
        name: 'Server',
        dockerfilePath: './packages/server/Dockerfile',
        imageName: `${PROJECT_NAME}/server`,
        imageTag: 'latest',
        buildArgs: [
            {
                key: 'NODE_ENV',
                value: argv.nodeEnv || 'development',
            },
        ],
    },
];

const buildDockerImage = ({ dockerfilePath, imageName, imageTag, buildArgs }) => {
    const buildArg = buildArgs.flatMap(({ key, value }) => ['--build-arg', `${key}=${value}`]);

    return $`docker build -f ${dockerfilePath} -t ${imageName}:${imageTag} ${buildArg} .`;
};

const main = async () => {
    await $`yarn install`;

    print(`Generating environment files`, 'cyan');
    const envVariables = [`PROJECT_NAME=${PROJECT_NAME}`];
    await fs.writeFile('./packages/deploy/.env', envVariables.join(os.EOL));

    for (const dockerImage of dockerImages) {
        print(`Building "${dockerImage.name}" Docker image`, 'cyan');
        await buildDockerImage(dockerImage);
        print(`Successfully built "${dockerImage.name}" Docker image`, 'green');
    }
};

await main();
