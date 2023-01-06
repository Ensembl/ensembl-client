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

import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';
import { createChrLocationValues } from 'tests/fixtures/browser';

describe('browserHelper', () => {
  describe('getChrLocationFromStr', () => {
    test('outputs ChrLocation when input received as string', () => {
      const chrLocationValues = createChrLocationValues();
      expect(
        getChrLocationFromStr(chrLocationValues.stringValue)
      ).toStrictEqual(chrLocationValues.tupleValue);
    });
  });

  describe('getChrLocationStr', () => {
    const chrLocationValues = createChrLocationValues();
    test('outputs string when input received as ChrLocation', () => {
      expect(getChrLocationStr(chrLocationValues.tupleValue)).toBe(
        chrLocationValues.stringValue
      );
    });
  });
});
