module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '(assets/.*)$': '<rootDir>/$1'
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  setupTestFrameworkScriptFile: '<rootDir>/setup-enzyme.ts',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(css|scss|png|jpg|svg|gif|eot|ttf|otf|woff|woff2)$':
      'jest-transform-stub'
  }
};
