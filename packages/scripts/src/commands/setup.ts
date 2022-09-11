import { EOL } from 'node:os';
import { join } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { cyan, green } from 'chalk';
import { chmodSync, ensureFileSync, existsSync, moveSync, pathExistsSync, readFileSync, writeFileSync } from 'fs-extra';
import _ from 'lodash';

import { PATH } from '../utils/constants';
import { SetupState, createStateCacheManager } from '../utils/setupCache';
import { Step, askQuestion, createEnvVariables, generatePassword, generateUsername } from '../utils/setupUtils';

const TEMLATES_PATH = join(PATH.Scripts, 'setupTemplates');
const FILES_DEST_PATH = PATH.DeployProd.Root;
const FILES_BACKUP_PATH = join(PATH.DeployProd.Root, 'backup');

interface CreateFileFromTemplateOptions {
    chmod?: number;
}

interface QuestionDataEntry {
    question: string;
    defaultValue?: unknown;
    generateValue?: () => string;
    guideUrl?: string;
}

interface Question {
    name: string;
    guideUrl?: string;
    data: Record<string, QuestionDataEntry>;
}

export class SetupCommand extends Command {
    private state!: SetupState;

    static description = 'Setup or update your environment';

    static flags = {
        fresh: Flags.boolean({
            required: true,
            default: false,
        }),
    };

    async run() {
        const { flags } = await this.parse(SetupCommand);

        const TIME_ZONE = readFileSync('/etc/timezone', { encoding: 'utf-8' }).trim();

        const QUESTIONS: Record<Step, Question> = {
            [Step.General]: {
                name: 'General information',
                data: {
                    timeZone: {
                        question: `Your time zone`,
                        defaultValue: TIME_ZONE,
                    },
                    publicUrl: {
                        question: `The public application URL (For example: "https://google.com")`,
                    },
                },
            },
            [Step.SetupGoogleOAuth]: {
                name: 'Setup Google OAuth 2.0',
                guideUrl: 'https://support.google.com/cloud/answer/6158849',
                data: {
                    googleClientId: {
                        question: `Your Google API client ID`,
                    },
                    googleClientSecret: {
                        question: `Your Google API client secret`,
                    },
                },
            },
            [Step.SetupServerAuth]: {
                name: 'Setup authorization for the server',
                data: {
                    rootUserEmail: {
                        question: `The admin's email address (the server will create his account automatically)`,
                    },
                    jwtSecret: {
                        question: `Secret for signing JWT tokens (auto generated when empty)`,
                        generateValue: generatePassword,
                    },
                },
            },

            [Step.SetupPostgresAuth]: {
                name: 'Setup authorization for PostgreSQL',
                data: {
                    postgresUsername: {
                        question: `PostgreSQL username (auto generated when empty)`,
                        generateValue: generateUsername,
                    },
                    postgresPassword: {
                        question: `PostgreSQL password (auto generated when empty)`,
                        generateValue: generatePassword,
                    },
                },
            },

            [Step.SetupMosquittoAuth]: {
                name: 'Setup authorization for Mosquitto',
                data: {
                    mosquittoUsername: {
                        question: `Mosquitto username (auto generated when empty)`,
                        generateValue: generateUsername,
                    },
                    mosquittoPassword: {
                        question: `Mosquitto password (auto generated when empty)`,
                        generateValue: generatePassword,
                    },
                },
            },

            [Step.SetupZigbee]: {
                name: 'Setup Zigbee',
                data: {
                    zigbeeAdapterLocation: {
                        question: `Zigbee adapter location`,
                        guideUrl: 'https://www.zigbee2mqtt.io/guide/getting-started/#_1-find-the-zigbee-adapter',
                    },
                },
            },
        };

        const stateManager = createStateCacheManager();
        this.state = stateManager.load(flags.fresh);

        for (const [step, { name, guideUrl, data }] of Object.entries(QUESTIONS)) {
            this.log(cyan(name));

            if (guideUrl) {
                this.log(green.underline(`Guide: ${guideUrl}`));
            }

            for (const [dataEntryKey, { question, defaultValue, generateValue, guideUrl }] of Object.entries(data)) {
                const fromCache = this.state.getStepDataEntryValue(step, dataEntryKey);

                if (guideUrl) {
                    this.log(green.underline(`Guide: ${guideUrl}`));
                }

                const isRequired = !generateValue;
                let answer = await askQuestion(question, isRequired, fromCache || defaultValue);
                if (!answer && generateValue) {
                    answer = generateValue();
                }

                this.state.setStepDataEntryValue(step, dataEntryKey, answer);
                stateManager.save();
            }
        }

        this.generateDotEnv();
        this.generateZigbeeConfig();
        this.generateOtherFiles();

        this.log(green('Done!'));
    }

    private createFileFromTemplate = (filename: string, opts?: CreateFileFromTemplateOptions) => {
        const templatePath = join(TEMLATES_PATH, filename);
        const destPath = join(FILES_DEST_PATH, filename);
        const backupPath = join(FILES_BACKUP_PATH, filename);

        if (existsSync(destPath)) {
            this.log(green(`Backing up the current ${filename}`));

            moveSync(destPath, backupPath, {
                overwrite: true,
            });
        }

        this.log(green(`Generating a new ${filename}`));

        const template = readFileSync(templatePath);
        ensureFileSync(destPath);
        writeFileSync(destPath, template);

        if (opts?.chmod) {
            chmodSync(destPath, opts.chmod);
        }
    };

    private generateDotEnv = () => {
        const envVar = createEnvVariables(this.state);

        const content = Object.entries(envVar)
            .map(([key, value]) => `${key}=${value}`)
            .join(EOL);

        const filename = '.env';
        this.createFileFromTemplate(filename);
        writeFileSync(join(FILES_DEST_PATH, filename), content);
    };

    private generateZigbeeConfig = () => {
        const envVar = createEnvVariables(this.state);

        const filename = 'zigbee2mqtt-configuration.yaml';

        if (pathExistsSync(join(FILES_DEST_PATH, filename))) {
            return;
        }

        const content = readFileSync(join(TEMLATES_PATH, filename), { encoding: 'utf-8' }).replaceAll(
            /\${(\w*)}/g,
            (_template, key) => {
                type EnvVarKey = keyof typeof envVar;
                return (envVar[key as EnvVarKey] as string) || '';
            },
        );

        this.createFileFromTemplate(filename, {});
        writeFileSync(join(FILES_DEST_PATH, filename), content);
    };

    private generateOtherFiles = () => {
        this.createFileFromTemplate('docker-compose.yml');
        this.createFileFromTemplate('mosquitto.conf');
        this.createFileFromTemplate('mosquitto-entrypoint.sh', {
            chmod: 0o755,
        });
        this.createFileFromTemplate('nginx.conf');
    };
}
