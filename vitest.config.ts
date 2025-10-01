/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    css: {
      modules: {
        classNameStrategy: 'non-scoped' // keep original class names
      }
    }
    // setupFiles: './setupTests.ts',
  },
  resolve: {
    alias: {
      // Handle absolute imports like "src/..."
      src: path.resolve(__dirname, './src'),

      // Map "config" to your config.ts
      config: path.resolve(__dirname, './config.ts'),

      // Handle static assets
      static: path.resolve(__dirname, './static'),

      // Example: stub out browser-specific static files
      'static/browser': path.resolve(__dirname, './static/browser'),

      // Mock SVGs
      '\\.svg': path.resolve(__dirname, './tests/svgrMock.js'),

      tests: path.resolve(__dirname, 'tests')
    }
  }
});
