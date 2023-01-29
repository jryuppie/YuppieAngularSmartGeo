module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['./src/setupJest.ts'],
    coverageDirectory: 'coverage/jest',
    testPathIgnorePatterns: [
      './node_modules/',
      './dist/',
      './src/test.ts',
    ],
    globals: {
      'ts-jest': {
        tsConfig: './tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
        astTransformers: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  };