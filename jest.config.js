module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*\\.test)\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
};
