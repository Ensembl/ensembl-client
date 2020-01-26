import faker from 'faker';

import { getStepLengthInNucleotides } from './featureLengthAxisHelper';

describe('stepWidthCalculator', () => {
  test('the step is 1 in the 1 - 10 interval', () => {
    const start = faker.random.number();
    const end = faker.random.number({ min: start + 1, max: start + 10 });
    expect(getStepLengthInNucleotides(start, end)).toBe(1);
  });

  test('step lengths for some arbitrary numbers', () => {
    // checking arbitrary numbers, because it's hard to come up with a clear general example
    expect(getStepLengthInNucleotides(1, 12)).toBe(2);
    expect(getStepLengthInNucleotides(1, 19)).toBe(2);
    expect(getStepLengthInNucleotides(1, 20)).toBe(2);

    expect(getStepLengthInNucleotides(1, 21)).toBe(5);
    expect(getStepLengthInNucleotides(1, 49)).toBe(5);
    expect(getStepLengthInNucleotides(1, 50)).toBe(5);

    expect(getStepLengthInNucleotides(1, 51)).toBe(10);
    expect(getStepLengthInNucleotides(1, 99)).toBe(10);
    expect(getStepLengthInNucleotides(1, 100)).toBe(10);

    expect(getStepLengthInNucleotides(1, 101)).toBe(20);
    expect(getStepLengthInNucleotides(1, 199)).toBe(20);
    expect(getStepLengthInNucleotides(1, 200)).toBe(20);

    expect(getStepLengthInNucleotides(1, 201)).toBe(50);
    expect(getStepLengthInNucleotides(1, 593)).toBe(100);
    expect(getStepLengthInNucleotides(1, 1201)).toBe(200);
    expect(getStepLengthInNucleotides(1, 3921)).toBe(500);
    expect(getStepLengthInNucleotides(1, 5367)).toBe(1000);
    expect(getStepLengthInNucleotides(1, 25623)).toBe(5000);
    expect(getStepLengthInNucleotides(1, 84792)).toBe(10000);
    expect(getStepLengthInNucleotides(1, 2486000)).toBe(500000);
  });
});
