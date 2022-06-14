module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 4,
    bracketSpacing: true,
    overrides: [
        {
            files: ['*.json', '*.yml', '*.yaml', '*.mjml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
    plugins: [require('prettier-plugin-sorted')],
};
