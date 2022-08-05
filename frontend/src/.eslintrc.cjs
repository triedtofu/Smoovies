module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'indent': ['warn', 2],
    'jsx-quotes': ['warn', 'prefer-double'],
    'no-console': ['warn'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
  },
};