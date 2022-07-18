export default {
    projects: [
        {
            displayName: 'functional',
            testMatch: ['<rootDir>/src/testsFunctional/**/*.mjs'],
            preset: 'ts-jest/presets/default-esm',
            globals: {
                'ts-jest': {
                    useESM: true,
                },
            },
            moduleNameMapper: {
                '^(\\.{1,2}/.*)\\.js$': '$1',
            },
            setupFilesAfterEnv: [
                'jest-extended/all',
                'jest-date',
                '<rootDir>/src/jest/expectWithMessage.mjs',
                '<rootDir>/src/jest/setup.mjs',
            ],
            runner: 'groups',
        },
        {
            displayName: 'integration',
            testMatch: ['<rootDir>/src/testsIntegration/**/*.mjs'],
            preset: 'ts-jest/presets/default-esm',
            globals: {
                'ts-jest': {
                    useESM: true,
                },
            },
            moduleNameMapper: {
                '^(\\.{1,2}/.*)\\.js$': '$1',
            },
            setupFilesAfterEnv: [
                'jest-extended/all',
                'jest-date',
                '<rootDir>/src/jest/expectWithMessage.mjs',
                '<rootDir>/src/jest/setup.mjs',
            ],
            runner: 'groups',
        },
    ],
};
