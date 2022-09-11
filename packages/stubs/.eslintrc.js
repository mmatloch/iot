module.exports = {
    env: {
        es6: true,
        node: true,
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
        },
    ],
};
