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

import { getFormattedDate, getFormattedDateTime } from './dateFormatter';

const testDateInput = new Date('December 17, 2020 03:24:47'); // just an arbitrary date

describe('getFormattedDate', () => {
  it('returns a formatted date', () => {
    expect(getFormattedDate(testDateInput)).toBe('2020-12-17');
  });
});

describe('getFormattedDateTime', () => {
  it('returns a formatted date with time', () => {
    expect(getFormattedDateTime(testDateInput)).toBe('2020-12-17, 03:24');
  });
});
