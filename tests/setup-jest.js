jest.mock('src/services/google-analytics');

// from https://github.com/facebook/jest/issues/10784#issuecomment-824931509 — suggestion for tracking unhandled rejection warnings
process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection', reason, promise);
});

const { TextEncoder, TextDecoder } = require('util'); // eslint-disable-line @typescript-eslint/no-var-requires

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
