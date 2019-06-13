import { getCommaSeparatedNumber } from './numberFormatter';

import faker from 'faker';

describe('getCommaSeparatedNumber', () => {
  it('returns x,xxx for the input number xxxx', () => {
    const randomNumber = faker.random.number({ min: 1000, max: 9999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 1
    expect(numberSplitByComma[0].length).toBe(1);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);
  });

  it('returns xx,xxx for the input number xxxxx', () => {
    const randomNumber = faker.random.number({ min: 10000, max: 99999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 2
    expect(numberSplitByComma[0].length).toBe(2);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);
  });

  it('returns xxx,xxx for the input number xxxxxx', () => {
    const randomNumber = faker.random.number({ min: 100000, max: 999999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 3
    expect(numberSplitByComma[0].length).toBe(3);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);
  });

  it('returns x,xxx,xxx for the input number xxxxxxx', () => {
    const randomNumber = faker.random.number({ min: 1000000, max: 9999999 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(3);

    // Check if the length of the first element is 3
    expect(numberSplitByComma[0].length).toBe(1);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[2].length).toBe(3);
  });

  it('returns -x,xxx for the input number -xxxx', () => {
    const randomNumber = faker.random.number({ min: -9999, max: -1000 });

    const formattedRandomNumber = getCommaSeparatedNumber(randomNumber);

    const numberSplitByComma = formattedRandomNumber.split(',');

    // Check if there are two elements in the array
    expect(numberSplitByComma.length).toBe(2);

    // Check if the length of the first element is 1
    expect(numberSplitByComma[0].length).toBe(2);

    // Check if the length of the second element is 3
    expect(numberSplitByComma[1].length).toBe(3);

    expect(Number(numberSplitByComma.join(''))).toBe(randomNumber);
  });
});
