export default {
    projects: [
        {
            displayName: 'Functional',
            testMatch: ['<rootDir>/src/functional/**/*.mjs'],
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
