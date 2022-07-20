import crypto from 'node:crypto';
import { URL } from 'node:url';

import async from 'async';
import _ from 'lodash';
import { $, chalk, fs, os, path, question } from 'zx';

import { PROJECT_NAME } from './utils/constants.mjs';
import { print } from './utils/print.mjs';

const STATE_PATH = '.cache/setupState.json';

const TEMLATES_PATH = './packages/scripts/setupTemplates';
const FILES_DEST_PATH = './packages/deploy/prod';
const FILES_BACKUP_PATH = './packages/deploy/prod/backup';

$.verbose = false;
const TIME_ZONE = (await $`cat /etc/timezone`).toString().trim();
$.verbose = true;

const setDefaults = (scriptParams) =>
    _.defaults(scriptParams, {
        interactive: true,
        fresh: false,
    });

const createStateCacheManager = () => {
    let cache = {
        rawData: {
            steps: {},
        },
        getStep: function (step) {
            return _.get(this.rawData.steps, step);
        },
        getStepData: function (step) {
            return _.get(this.getStep(step), 'data');
        },
        getStepDataEntryValue: function (step, stepDataEntryKey) {
            return _.get(this.getStepData(step), stepDataEntryKey);
        },
        setStepDataEntryValue: function (step, stepDataEntryKey, stepDataEntryValue) {
            _.set(this.rawData.steps, `${step}.data.${stepDataEntryKey}`, stepDataEntryValue);
        },
    };

    const exists = () => fs.existsSync(STATE_PATH);

    const load = (useFresh) => {
        if (!useFresh && exists()) {
            cache.rawData = fs.readJsonSync(STATE_PATH);
        }

        return cache;
    };

    const save = () => {
        fs.outputFileSync(STATE_PATH, JSON.stringify(cache.rawData, null, 2));
    };

    return {
        load,
        save,
    };
};

const stateUtils = {
    hasCompleteStepData: function (stepState, currentStepData) {
        if (!stepState?.data) {
            return false;
        }

        return Object.keys(currentStepData).every((key) => _.has(stepState.data, key));
    },
};

const Step = {
    General: 'GENERAL',
    SetupGoogleOAuth: 'SETUP_GOOGLE_OAUTH',
    SetupServerAuth: 'SETUP_SERVER_AUTH',
    SetupPostgresAuth: 'SETUP_POSTGRES_AUTH',
    SetupMosquittoAuth: 'SETUP_MOSQUITTO_AUTH',
    SetupZigbee: 'SETUP_ZIGBEE',
};

const generateUsername = () => crypto.randomBytes(12).toString('hex');
const generatePassword = () => crypto.randomBytes(31).toString('hex');

const questions = {
    [Step.General]: {
        name: 'General information',
        data: {
            timeZone: {
                askQuestion: () => question(`Your time zone (${TIME_ZONE} when empty): ${os.EOL}`),
                scriptParam: 'timeZone',
                generateValue: () => TIME_ZONE,
            },
        },
    },
    [Step.SetupGoogleOAuth]: {
        name: 'Setup Google OAuth 2.0',
        guideUrl: 'https://support.google.com/cloud/answer/6158849',
        data: {
            googleClientId: {
                askQuestion: () => question(`Your Google API client ID: ${os.EOL}`),
                scriptParam: 'googleClientId',
            },
            googleClientSecret: {
                askQuestion: () => question(`Your Google API client secret: ${os.EOL}`),
                scriptParam: 'googleClientSecret',
            },
        },
    },
    [Step.SetupServerAuth]: {
        name: 'Setup authorization for the server',
        data: {
            rootUserEmail: {
                askQuestion: () =>
                    question(`The admin's email address (the server will create his account automatically): ${os.EOL}`),
                scriptParam: 'rootUserEmail',
            },
            jwtSecret: {
                askQuestion: () => question(`Secret for signing JWT tokens (auto generated when empty): ${os.EOL}`),
                scriptParam: 'jwtSecret',
                generateValue: generatePassword,
            },
        },
    },

    [Step.SetupPostgresAuth]: {
        name: 'Setup authorization for PostgreSQL',
        data: {
            postgresUsername: {
                askQuestion: () => question(`PostgreSQL username (auto generated when empty): ${os.EOL}`),
                scriptParam: 'postgresUsername',
                generateValue: generateUsername,
            },
            postgresPassword: {
                askQuestion: () => question(`PostgreSQL password (auto generated when empty): ${os.EOL}`),
                scriptParam: 'postgresPassword',
                generateValue: generatePassword,
            },
        },
    },

    [Step.SetupMosquittoAuth]: {
        name: 'Setup authorization for Mosquitto',
        data: {
            mosquittoUsername: {
                askQuestion: () => question(`Mosquitto username (auto generated when empty): ${os.EOL}`),
                scriptParam: 'mosquittoUsername',
                generateValue: generateUsername,
            },
            mosquittoPassword: {
                askQuestion: () => question(`Mosquitto password (auto generated when empty): ${os.EOL}`),
                scriptParam: 'mosquittoPassword',
                generateValue: generatePassword,
            },
        },
    },

    [Step.SetupZigbee]: {
        name: 'Setup Zigbee',
        data: {
            zigbeeAdapterLocation: {
                askQuestion: () => question(`Zigbee adapter location: ${os.EOL}`),
                scriptParam: 'zigbeeAdapterLocation',
                guideUrl: 'https://www.zigbee2mqtt.io/guide/getting-started/#_1-find-the-zigbee-adapter',
            },
        },
    },
};

const createFileFromTemplate = (filename, opts) => {
    const templatePath = path.join(TEMLATES_PATH, filename);
    const destPath = path.join(FILES_DEST_PATH, filename);
    const backupPath = path.join(FILES_BACKUP_PATH, filename);

    if (fs.existsSync(destPath)) {
        print(`Backing up the current ${filename}`, 'green');
        fs.moveSync(destPath, backupPath, {
            overwrite: true,
        });
    }

    print(`Generating a new ${filename}`, 'green');

    const template = fs.readFileSync(templatePath);
    fs.ensureFileSync(destPath);
    fs.writeFileSync(destPath, template);

    if (opts?.chmod) {
        fs.chmod(destPath, opts.chmod);
    }
};

const createEnvVariables = (state) => {
    const { timeZone } = state.getStepData(Step.General);
    const { postgresUsername, postgresPassword } = state.getStepData(Step.SetupPostgresAuth);
    const { mosquittoUsername, mosquittoPassword } = state.getStepData(Step.SetupMosquittoAuth);
    const { googleClientId, googleClientSecret } = state.getStepData(Step.SetupGoogleOAuth);
    const { jwtSecret, rootUserEmail } = state.getStepData(Step.SetupServerAuth);
    const { zigbeeAdapterLocation } = state.getStepData(Step.SetupZigbee);

    const postgresUrl = new URL(`postgresql://postgres:5432/${PROJECT_NAME}`);
    postgresUrl.username = postgresUsername;
    postgresUrl.password = postgresPassword;

    const mosquittoUrl = new URL(`mqtt://mosquitto:1883`);
    mosquittoUrl.username = mosquittoUsername;
    mosquittoUrl.password = mosquittoPassword;

    return {
        PROJECT_NAME: PROJECT_NAME,
        TZ: timeZone,

        GOOGLE_OAUTH2_CLIENT_ID: googleClientId,
        GOOGLE_OAUTH2_CLIENT_SECRET: googleClientSecret,

        JWT_SECRET: jwtSecret,
        ROOT_USER_EMAIL: rootUserEmail,

        POSTGRES: postgresUrl,
        POSTGRES_USERNAME: postgresUsername,
        POSTGRES_PASSWORD: postgresPassword,

        MOSQUITTO: mosquittoUrl,
        MOSQUITTO_USERNAME: mosquittoUsername,
        MOSQUITTO_PASSWORD: mosquittoPassword,

        ZIGBEE_ADAPTER_LOCATION: zigbeeAdapterLocation,
    };
};

const generateDotEnv = (state) => {
    const envVar = createEnvVariables(state);

    const content = Object.entries(envVar)
        .map(([key, value]) => `${key}=${value}`)
        .join(os.EOL);

    const filename = '.env';
    createFileFromTemplate(filename);
    fs.writeFileSync(path.join(FILES_DEST_PATH, filename), content);
};

const generateZigbeeConfig = (state) => {
    const envVar = createEnvVariables(state);

    const filename = 'zigbee2mqtt-configuration.yaml';

    const content = fs
        .readFileSync(path.join(TEMLATES_PATH, filename), { encoding: 'utf-8' })
        .replaceAll(/\${(\w*)}/g, (_template, key) => {
            return envVar[key] || '';
        });

    createFileFromTemplate(filename);
    fs.writeFileSync(path.join(FILES_DEST_PATH, filename), content);
};

const generateOtherFiles = () => {
    createFileFromTemplate('docker-compose.yml');
    createFileFromTemplate('mosquitto.conf');
    createFileFromTemplate('mosquitto-entrypoint.sh', {
        chmod: 0o755,
    });
    createFileFromTemplate('nginx.conf');
};

const main = async (scriptParams) => {
    setDefaults(scriptParams);

    const stateManager = createStateCacheManager();

    const state = stateManager.load(scriptParams.fresh);

    await async.eachOfLimit(questions, 1, async ({ name, guideUrl, data }, step) => {
        const stepState = state.getStep(step);
        if (stateUtils.hasCompleteStepData(stepState, data)) {
            return;
        }

        print(name, 'cyan');

        if (guideUrl) {
            print(`Guide: ${chalk.underline(guideUrl)}`, 'green');
        }

        const getStepDataEntryValue = async ({ askQuestion, scriptParam, generateValue }, stepDataEntryKey) => {
            const fromCache = state.getStepDataEntryValue(step, stepDataEntryKey);

            if (fromCache) {
                return fromCache;
            }

            const fromParams = _.get(scriptParams, scriptParam);

            if (fromParams) {
                return fromParams;
            }

            const answer = await askQuestion();
            if (answer.length === 0 && generateValue) {
                return generateValue();
            }

            return answer;
        };

        await async.mapValuesLimit(data, 1, async (stepDataEntry, stepDataEntryKey) => {
            const stepDataEntryValue = await getStepDataEntryValue(stepDataEntry, stepDataEntryKey);

            state.setStepDataEntryValue(step, stepDataEntryKey, stepDataEntryValue);
            stateManager.save();
        });
    });

    generateDotEnv(state);
    generateZigbeeConfig(state);
    generateOtherFiles();

    print('Done!', 'green');
};

export const _description = 'Setup or update your environment';
export default main;
