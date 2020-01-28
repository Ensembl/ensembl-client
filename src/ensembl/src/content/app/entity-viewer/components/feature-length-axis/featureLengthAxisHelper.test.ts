import { scaleLinear } from 'd3';

import { getTicks } from './featureLengthAxisHelper';

describe('getTicks', () => {
  const width = 600;

  const generateScale = (length: number) =>
    scaleLinear()
      .domain([1, length])
      .range([0, width]);

  it('produces expected labelled ticks', () => {
    const length1 = 593;
    const length2 = 1160;
    const length3 = 3921;
    const length4 = 5367;
    const length5 = 25623;
    const length6 = 84792;
    const length7 = 304813;
    const length8 = 2486000;

    const scale1 = generateScale(length1);
    const scale2 = generateScale(length2);
    const scale3 = generateScale(length3);
    const scale4 = generateScale(length4);
    const scale5 = generateScale(length5);
    const scale6 = generateScale(length6);
    const scale7 = generateScale(length7);
    const scale8 = generateScale(length8);

    // const { labelledTicks: labelledTicks1 } = getTicks(scale1);
    console.log('getTicks(scale1)', getTicks(scale1));
    console.log('getTicks(scale2)', getTicks(scale2));
    console.log('getTicks(scale3)', getTicks(scale3));
    console.log('getTicks(scale4)', getTicks(scale4));
    console.log('getTicks(scale5)', getTicks(scale5));
    console.log('getTicks(scale6)', getTicks(scale6));
    console.log('getTicks(scale7)', getTicks(scale7));
    console.log('getTicks(scale8)', getTicks(scale8));
  });
});

// import { getStepLengthInNucleotides } from './featureLengthAxisHelper';

// describe('stepWidthCalculator', () => {
//   test('the step is 1 in the 1 - 10 interval', () => {
//     const start = faker.random.number();
//     const end = faker.random.number({ min: start + 1, max: start + 10 });
//     expect(getStepLengthInNucleotides(start, end)).toBe(1);
//   });

//   test('step lengths for some arbitrary numbers', () => {
//     // checking arbitrary numbers, because it's hard to come up with a clear general example
//     expect(getStepLengthInNucleotides(1, 12)).toBe(2);
//     expect(getStepLengthInNucleotides(1, 19)).toBe(2);
//     expect(getStepLengthInNucleotides(1, 20)).toBe(2);

//     expect(getStepLengthInNucleotides(1, 21)).toBe(5);
//     expect(getStepLengthInNucleotides(1, 49)).toBe(5);
//     expect(getStepLengthInNucleotides(1, 50)).toBe(5);

//     expect(getStepLengthInNucleotides(1, 51)).toBe(10);
//     expect(getStepLengthInNucleotides(1, 99)).toBe(10);
//     expect(getStepLengthInNucleotides(1, 100)).toBe(10);

//     expect(getStepLengthInNucleotides(1, 101)).toBe(20);
//     expect(getStepLengthInNucleotides(1, 199)).toBe(20);
//     expect(getStepLengthInNucleotides(1, 200)).toBe(20);

//     expect(getStepLengthInNucleotides(1, 201)).toBe(50);
//     expect(getStepLengthInNucleotides(1, 593)).toBe(100);
//     expect(getStepLengthInNucleotides(1, 1201)).toBe(200);
//     expect(getStepLengthInNucleotides(1, 3921)).toBe(500);
//     expect(getStepLengthInNucleotides(1, 5367)).toBe(1000);
//     expect(getStepLengthInNucleotides(1, 25623)).toBe(5000);
//     expect(getStepLengthInNucleotides(1, 84792)).toBe(10000);
//     expect(getStepLengthInNucleotides(1, 2486000)).toBe(500000);
//   });
// });
