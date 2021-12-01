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

import { isEnvironment, Environment } from './environment';

describe('isEnvironment', () => {
  // Set the environment to development
  process.env.ENVIRONMENT = 'development';

  it('returns true if the envrionment matches', () => {
    const isAvailableOnEnvironment = isEnvironment([Environment.DEVELOPMENT]);

    expect(isAvailableOnEnvironment).toBe(true);
  });

  it('returns false if the envrionment does not match', () => {
    const isAvailableOnEnvironment = isEnvironment([Environment.PRODUCTION]);

    expect(isAvailableOnEnvironment).toBe(false);
  });

  it('supports multiple environments as input and returns true if at least one matches', () => {
    const isAvailableOnEnvironment = isEnvironment([
      Environment.DEVELOPMENT,
      Environment.INTERNAL
    ]);

    expect(isAvailableOnEnvironment).toBe(true);
  });
});
