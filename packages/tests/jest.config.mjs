export default {
    projects: [
        {
            displayName: 'functional',
            testMatch: ['<rootDir>/src/testsFunctional/**/*.mjs'],
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
            transform: {
                '^.+\\.(t|j)sx?$': ['@swc/jest'],
            },
            extensionsToTreatAsEsm: ['.ts'],
        },
        {
            displayName: 'integration',
            testMatch: ['<rootDir>/src/testsIntegration/**/*.mjs'],
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
            transform: {
                '^.+\\.(t|j)sx?$': ['@swc/jest'],
            },
            extensionsToTreatAsEsm: ['.ts'],
        },
    ],
};
