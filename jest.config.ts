import { Config } from "jest"

/* eslint-disable */
const config: Config = {
  displayName: 'payments-challenge',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/payments-challenge',
  coverageReporters: ['text', 'json', 'lcov', 'clover', 'cobertura', 'html'],
  testMatch: [
    '<rootDir>/app/**/tests/**/*.[jt]s?(x)',
    '<rootDir>/app/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};

export default config
