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
    // The `deps` block is added, because jsdom seems to be calling `require` for parse5, which is causing errors
    deps: {
      optimizer: {
        web: {
          include: ['parse5']
        }
      }
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped' // keep original class names
      }
    },
    setupFiles: ['./tests/setup.ts', './tests/setup-rtl.ts'],
    pool: 'threads',
    alias: [
      // Mock SVGs
      {
        find: /^.+\.svg$/,
        replacement: path.resolve(__dirname, './tests/svgrMock.tsx')
      }
    ]
  },
  resolve: {
    alias: [
      // Handle absolute imports like "src/..."
      { find: 'src', replacement: path.resolve(__dirname, './src') },

      // Map "config" to config.ts
      { find: 'config', replacement: path.resolve(__dirname, './config.ts') },

      // Handle static assets
      { find: 'static', replacement: path.resolve(__dirname, './static') },

      // Stub out browser-specific static files
      {
        find: 'static/browser',
        replacement: path.resolve(__dirname, './static/browser')
      },

      // Resolve tests directory
      { find: 'tests', replacement: path.resolve(__dirname, 'tests') }
    ]
  }
});
