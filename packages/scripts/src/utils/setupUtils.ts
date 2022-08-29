import crypto from 'node:crypto';

import { CliUx } from '@oclif/core';

import { PRODUCTION_IMAGE_REPO, PROJECT_NAME } from './constants';
import { SetupState } from './setupCache';

const { ux } = CliUx;

export const generateUsername = () => crypto.randomBytes(12).toString('hex');
export const generatePassword = () => crypto.randomBytes(31).toString('hex');

export const askQuestion = async (question: string, required: boolean, defaultValue?: unknown): Promise<string> => {
    return ux.prompt(question, {
        default: defaultValue as string,
        required,
    });
};

export enum Step {
    General = 'GENERAL',
    SetupGoogleOAuth = 'SETUP_GOOGLE_OAUTH',
    SetupServerAuth = 'SETUP_SERVER_AUTH',
    SetupPostgresAuth = 'SETUP_POSTGRES_AUTH',
    SetupMosquittoAuth = 'SETUP_MOSQUITTO_AUTH',
    SetupZigbee = 'SETUP_ZIGBEE',
}

export const createEnvVariables = (state: SetupState) => {
    const { timeZone, publicUrl } = state.getStepData(Step.General);
    const { postgresUsername, postgresPassword } = state.getStepData(Step.SetupPostgresAuth);
    const { mosquittoUsername, mosquittoPassword } = state.getStepData(Step.SetupMosquittoAuth);
    const { googleClientId, googleClientSecret } = state.getStepData(Step.SetupGoogleOAuth);
    const { jwtSecret, rootUserEmail } = state.getStepData(Step.SetupServerAuth);
    const { zigbeeAdapterLocation } = state.getStepData(Step.SetupZigbee);

    const postgresUrl = new URL(`postgresql://timescale:5432/${PROJECT_NAME}`);
    postgresUrl.username = String(postgresUsername);
    postgresUrl.password = String(postgresPassword);

    const mosquittoUrl = new URL(`mqtt://mosquitto:1883`);
    mosquittoUrl.username = String(mosquittoUsername);
    mosquittoUrl.password = String(mosquittoPassword);

    return {
        IMAGE_REPO: PRODUCTION_IMAGE_REPO,
        PROJECT_NAME: PROJECT_NAME,
        PUBLIC_URL: publicUrl,
        TZ: timeZone,

        GOOGLE_OAUTH2_CLIENT_ID: googleClientId,
        GOOGLE_OAUTH2_CLIENT_SECRET: googleClientSecret,
        GOOGLE_OAUTH2_REDIRECT_URI: new URL(`/auth/redirect/google`, publicUrl as string).toString(),

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
