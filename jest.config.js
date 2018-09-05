module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleNameMapper: {
    '(assets\/.*)$': '<rootDir>/$1'
  },
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|scss|png|jpg|svg|gif|eot|ttf|otf|woff|woff2)$': 'jest-transform-stub'
  },
  testRegex: '(.*\.test\.tsx?)$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupTestFrameworkScriptFile: '<rootDir>/setup-enzyme.ts'
};
