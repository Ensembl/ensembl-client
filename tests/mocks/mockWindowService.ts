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

import { WindowServiceInterface } from 'src/services/window-service';

export const mockMatchMedia = () => () => ({
  matches: true,
  addEventListener: () => null,
  removeEventListener: () => null
});

const mockWindowService: WindowServiceInterface = {
  getLocalStorage: vi.fn(),
  getSessionStorage: vi.fn(),
  getResizeObserver: vi.fn(),
  getMatchMedia: vi.fn().mockImplementation(mockMatchMedia),
  getWindow: vi.fn(),
  getFileReader: vi.fn(),
  getLocation: vi.fn()
};

export default mockWindowService;
