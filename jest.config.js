const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^../src/firebaseClient$': '<rootDir>/src/__mocks__/firebaseClient.ts',
  },
};

module.exports = createJestConfig(customJestConfig);
