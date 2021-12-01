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

import { getCommaSeparatedNumber } from './numberFormatter';

import faker from 'faker';

describe('getCommaSeparatedNumber', () => {
  it('returns x,xxx for the input number xxxx', () => {
    const randomNumber = faker.datatype.number({ min: 1000, max: 9999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 1
    expect(numberSplitByComma[0].length).toBe(1);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });

  it('returns xx,xxx for the input number xxxxx', () => {
    const randomNumber = faker.datatype.number({ min: 10000, max: 99999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 2
    expect(numberSplitByComma[0].length).toBe(2);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });

  it('returns xxx,xxx for the input number xxxxxx', () => {
    const randomNumber = faker.datatype.number({ min: 100000, max: 999999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 3
    expect(numberSplitByComma[0].length).toBe(3);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });

  it('returns x,xxx,xxx for the input number xxxxxxx', () => {
    const randomNumber = faker.datatype.number({ min: 1000000, max: 9999999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are three elements in the array
    expect(numberSplitByComma.length).toBe(3);

    // Check if the length of the first element is 1
    expect(numberSplitByComma[0].length).toBe(1);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    // Check if the length of the third element is 3
    expect(numberSplitByComma[2].length).toBe(3);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });

  it('returns -x,xxx for the input number -xxxx', () => {
    const randomNumber = faker.datatype.number({ min: -9999, max: -1000 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 2
    expect(numberSplitByComma[0].length).toBe(2);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });

  it('returns x,xxx.x for the input number xxxx.x', () => {
    const randomNumber =
      faker.datatype.number({ min: 1000, max: 9999 }) +
      faker.datatype.number({ min: 1, max: 9 }) / 10;

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 1
    expect(numberSplitByComma[0].length).toBe(1);

    // Check if the length of the second element is 5
    expect(numberSplitByComma[1].length).toBe(5);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });
});
