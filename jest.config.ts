/* eslint-disable */
export default {
  displayName: 'payments-challenge',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/payments-challenge',
  testMatch: [
    '<rootDir>/app/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/app/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
