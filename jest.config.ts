import { Config } from "jest"

/* eslint-disable */
const config: Config = {
  displayName: 'payments-challenge',
  preset: './jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  watchPathIgnorePatterns: ['globalConfig'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/',
  coverageReporters: ['text', 'json', 'lcov', 'clover', 'cobertura', 'html'],
  testMatch: [
    '<rootDir>/app/**/tests/(?!mocks/)**/*.[jt]s?(x)',
    '<rootDir>/app/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
  coverageThreshold: {
    global: {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
};

export default config
