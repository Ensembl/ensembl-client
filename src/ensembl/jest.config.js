module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/tests/svgrMock.js',
    '^config$': '<rootDir>/config.ts',
    '(tests/.*)$$': '<rootDir>/$1',
    '(src/.*)$': '<rootDir>/$1',
    '(static/.*)$': '<rootDir>/$1',
    '(static/browser/.*)$': '<rootDir>/$1.stub.js',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/setup-jest.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-enzyme.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(css|scss|png|jpg|svg|gif|eot|ttf|otf|woff|woff2)$':
      'jest-transform-stub'
  }
};
