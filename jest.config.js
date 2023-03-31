const path = require('path');

// D3, since version 7, is distributed only as ES modules,
// which presents a problem for Jest, as it is configured for our project (uses commonjs modules)
// The solution for this problem is taken from the list of possible solutions in D3's Changelog
// (https://github.com/recharts/recharts/commit/e62d0cf8aaecdc135615c40ae6d95288026d97d5)
const d3Pkgs = [
	'd3',
	'd3-array',
	'd3-axis',
	'd3-brush',
	'd3-chord',
	'd3-color',
	'd3-contour',
	'd3-delaunay',
	'd3-dispatch',
	'd3-drag',
	'd3-dsv',
	'd3-ease',
	'd3-fetch',
	'd3-force',
	'd3-format',
	'd3-geo',
	'd3-hierarchy',
	'd3-interpolate',
	'd3-path',
	'd3-polygon',
	'd3-quadtree',
	'd3-random',
	'd3-scale',
	'd3-scale-chromatic',
	'd3-selection',
	'd3-shape',
	'd3-time',
	'd3-time-format',
	'd3-timer',
	'd3-transition',
	'd3-zoom',
];

const d3ModuleNameMapper = d3Pkgs.reduce((acc, pkg) => {
	acc[`^${pkg}$`] = path.join(require.resolve(pkg), `../../dist/${pkg}.min.js`);
	return acc;
}, {});


module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/tests/svgrMock.js',
    '^config$': '<rootDir>/config.ts',
    '(tests/.*)$$': '<rootDir>/$1',
    '(src/.*)$': '<rootDir>/$1',
    '(static/.*)$': '<rootDir>/$1',
    '(static/browser/.*)$': '<rootDir>/$1.stub.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    ...d3ModuleNameMapper
  },
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/tests/setup-jest.js'],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup-rtl.ts'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.tsx?$': 'babel-jest',
    '.+\\.(css|scss|png|jpg|svg|gif|eot|ttf|otf|woff|woff2)$':
      'jest-transform-stub'
  }
};
