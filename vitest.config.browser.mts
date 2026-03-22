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

import path from 'node:path';
import { defineConfig } from 'vitest/config';
import viteReactPlugin from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [viteReactPlugin()],
  test: {
    globals: true,
    name: 'browser',
    browser: {
      provider: playwright(),
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
    include: ['**/AutosuggestSearchField.test.tsx'],
    setupFiles: ['./tests/setup.ts', './tests/setup-browser.ts'],
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
