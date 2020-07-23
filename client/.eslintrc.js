module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'array-bracket-spacing': [ 'error', 'always', {
            objectsInArrays: false,
        }],
        'comma-dangle': [ 'warn', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
        }],
        'eol-last': [ 'error', 'always' ],
        'indent': [ 'error', 4 ],
        'no-multiple-empty-lines': [ 'error', {
            max: 2,
        }],
        'no-prototype-builtins': 0,
        'no-trailing-spaces': 'error',
        'no-unused-vars': [ 'error', {
            args: 'after-used',
            'argsIgnorePattern': '^_',
        }],
        'object-curly-spacing': [ 'error', 'always' ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ],
        'react/prop-types': 'off',
    },
};
