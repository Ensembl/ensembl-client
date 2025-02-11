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

import {
  getGenomicLocationFromString,
  getGenomicLocationString
} from './genomicLocationHelpers';

describe('getGenomicLocationFromString', () => {
  it('parses string containing region name, start and end', () => {
    const test = '8:26219137-26444628';

    expect(getGenomicLocationFromString(test)).toEqual({
      regionName: '8',
      start: 26219137,
      end: 26444628
    });
  });
});

describe('getGenomicLocationString', () => {
  it('generates a genomic location string from GenomicLocation input', () => {
    expect(
      getGenomicLocationString({
        regionName: '8',
        start: 26219137,
        end: 26444628
      })
    ).toEqual('8:26219137-26444628');
  });
});
