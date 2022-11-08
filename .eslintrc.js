module.exports = {
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended'
            ],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
            rules: {
                '@typescript-eslint/no-empty-interface': 'off',
                'react/react-in-jsx-scope': 'off',
            },
            settings: {
                react: {
                    version: '18.2.0',
                },
            },
        },
    ],
};
