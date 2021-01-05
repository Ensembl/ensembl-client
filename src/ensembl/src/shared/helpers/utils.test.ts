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

import faker from 'faker';

import { omit } from './utils';

describe('omit', () => {
  it('removes the passed in key from the source object', () => {
    const key = faker.lorem.word();
    const key1 = faker.lorem.word();
    const key2 = faker.lorem.word();

    const obj = {
      [key]: {
        [key1]: {
          [key2]: {
            foo: 1,
            bar: 1
          }
        }
      }
    };

    const updateObj = {
      [key]: {
        [key1]: {
          [key2]: {
            bar: 1
          }
        }
      }
    };

    expect(omit(obj, [key, key1, key2, 'foo'])).toEqual(updateObj);
  });
});
