export default {
    projects: [
        {
            displayName: 'Functional tests',
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
            setupFilesAfterEnv: ['<rootDir>/src/jest/expectWithMessage.mjs'],
        },
    ],
};
