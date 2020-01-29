import { scaleLinear } from 'd3';

import { getTicks } from './featureLengthAxisHelper';

type Example = {
  length: number;
  ticks: number[];
  labelledTicks: number[];
};

// concrete test cases (because it's hard to come up with a random number generator for this)
const examples: Example[] = [
  {
    length: 100, // edge case: length is equal to the power of ten that we use to filter the ticks
    ticks: [50],
    labelledTicks: [50]
  },
  {
    length: 593,
    ticks: [100, 200, 300, 400, 500],
    labelledTicks: [100, 200, 300, 400, 500] // 500 is included in labelled ticks, because it's at more than 10% distance from 593
  },
  {
    length: 679,
    ticks: [100, 200, 300, 400, 500, 600],
    labelledTicks: [500] // can't have more than 5 labels
  },
  {
    length: 1160,
    ticks: [1000],
    labelledTicks: [1000]
  },
  {
    length: 3921,
    ticks: [1000, 2000, 3000],
    labelledTicks: [1000, 2000, 3000]
  },
  {
    length: 5367,
    ticks: [1000, 2000, 3000, 4000, 5000],
    labelledTicks: [1000, 2000, 3000, 4000] // notice that the last tick is not included in labelled ticks (less than 10% distance from length)
  },
  {
    length: 25623,
    ticks: [10000, 20000],
    labelledTicks: [10000, 20000]
  },
  {
    length: 84792,
    ticks: [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000],
    labelledTicks: [50000]
  },
  {
    length: 304813,
    ticks: [100000, 200000, 300000],
    labelledTicks: [100000, 200000]
  },
  {
    length: 304813,
    ticks: [100000, 200000, 300000],
    labelledTicks: [100000, 200000]
  },
  {
    length: 2486000,
    ticks: [1000000, 2000000],
    labelledTicks: [1000000, 2000000]
  }
];

describe('getTicks', () => {
  const width = 600;

  const generateScale = (length: number) =>
    scaleLinear()
      .domain([1, length])
      .range([0, width]);

  it('produces expected labelled ticks', () => {
    for (const example of examples) {
      const scale = generateScale(example.length);
      const { ticks, labelledTicks } = getTicks(scale);
      expect(ticks).toEqual(example.ticks);
      expect(labelledTicks).toEqual(example.labelledTicks);
    }
  });
});
