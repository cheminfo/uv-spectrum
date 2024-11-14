import cheminfo from 'eslint-config-cheminfo';

export default [
  ...cheminfo,
  {
    languageOptions: {
      globals: {
        __dirname: 'readonly',
      },
    },
    rules: {
      //      "camelcase": "off",
    },
  },
];
