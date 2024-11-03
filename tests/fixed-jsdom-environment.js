 /* eslint-disable @typescript-eslint/no-var-requires */
const JSDOMEnvironment = require('jest-environment-jsdom').default;
const { TextEncoder, TextDecoder } = require('node:util');

/**
 * NOTE:
 * The purpose of this file is to inject into the jsdom environment
 * the globals that should exist both in the browser and in Node,
 * but which Jest removes from Node.
 */

// Adapted from:
// https://github.com/jsdom/jsdom/issues/3363#issuecomment-1467894943

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);

    this.global.structuredClone = structuredClone;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
    this.global.BroadcastChannel = BroadcastChannel;
    this.global.TransformStream = TransformStream;
    this.global.Headers = Headers;
    this.global.FormData = FormData;
    this.global.fetch = fetch;
  }
}

module.exports = FixedJSDOMEnvironment;
