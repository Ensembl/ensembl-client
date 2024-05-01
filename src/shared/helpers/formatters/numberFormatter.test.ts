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

import { formatNumber, createSmallNumberFormatter } from './numberFormatter';

import { faker } from '@faker-js/faker';

describe('formatNumber', () => {
  it('returns x,xxx for the input number xxxx', () => {
    const randomNumber = faker.number.int({ min: 1000, max: 9999 });

    const formattedRandomNumber = formatNumber(randomNumber);

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
    const randomNumber = faker.number.int({ min: 10000, max: 99999 });

    const formattedRandomNumber = formatNumber(randomNumber);

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
    const randomNumber = faker.number.int({ min: 100000, max: 999999 });

    const formattedRandomNumber = formatNumber(randomNumber);

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
    const randomNumber = faker.number.int({ min: 1000000, max: 9999999 });

    const formattedRandomNumber = formatNumber(randomNumber);

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
    const randomNumber = faker.number.int({ min: -9999, max: -1000 });

    const formattedRandomNumber = formatNumber(randomNumber);

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
      faker.number.int({ min: 1000, max: 9999 }) +
      faker.number.int({ min: 1, max: 9 }) / 10;

    const formattedRandomNumber = formatNumber(randomNumber);

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

describe('createSmallNumberFormatter', () => {
  describe('when formatted number should be truncated, and scientific notation applied', () => {
    const commonFormattingOptions = {
      maximumSignificantDigits: 5
    };

    test('0.999959690 is formatted as 0.99995', () => {
      const formatter = createSmallNumberFormatter(commonFormattingOptions);
      // Notice that the number is truncated rather than rounded!
      expect(formatter.format(0.99995969)).toBe('0.99995');
    });

    test('0.000123 is formatted as 0.000123', () => {
      const formatter = createSmallNumberFormatter(commonFormattingOptions);

      // By default, the value below which the formatter will switch to scientific notation is 0.0001
      // Therefore, given 0.000123 as an input, the formatter should return this number unchanged
      expect(formatter.format(0.000123)).toBe('0.000123');
    });

    test('0.0000123 is formatted as 1.23e-5', () => {
      const formatter = createSmallNumberFormatter(commonFormattingOptions);
      expect(formatter.format(0.0000123)).toBe('1.23e-5');
    });

    test('0.0000012395 is formatted as 1.23e-6', () => {
      const formattingOptions = {
        ...commonFormattingOptions,
        scientificNotation: {
          maximumSignificantDigits: 3
        }
      };
      const formatter = createSmallNumberFormatter(formattingOptions);
      // Notice that the number got truncated rather than rounded!
      expect(formatter.format(0.0000012395)).toBe('1.23e-6');
    });
  });

  describe('with scientific notation, but without truncation', () => {
    test('0.999959690 is formatted as 0.99995969', () => {
      const formatter = createSmallNumberFormatter();

      // Note that the trailing zero is removed,
      // because the Number type has no memory of its literal representation.
      expect(formatter.format(0.99995969)).toBe('0.99995969');
    });

    test('0.00000123 is formatted as 1.23e-6', () => {
      const formatter = createSmallNumberFormatter();
      expect(formatter.format(0.00000123)).toBe('1.23e-6');
    });

    test('0.0000012395 is formatted as 1.2395e-6', () => {
      const formatter = createSmallNumberFormatter();
      expect(formatter.format(0.0000012395)).toBe('1.2395e-6');
    });
  });
});
