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

import { scaleLinear } from 'd3';

import { getTicks } from './basePairsRulerHelper';

type Example = {
  length: number;
  ticks: number[];
  labelledTicks: number[];
};

// concrete test cases (because it's hard to come up with a random number generator for this)
const examples: Example[] = [
  {
    length: 5,
    ticks: [2, 3, 4],
    labelledTicks: [2, 3, 4]
  },
  {
    length: 7,
    ticks: [2, 3, 4, 5, 6],
    labelledTicks: [2, 3, 4, 5, 6] // 5 intermediate labels at most
  },
  {
    length: 8,
    ticks: [2, 3, 4, 5, 6, 7],
    labelledTicks: [5]
  },
  {
    length: 100, // edge case: length is equal to the power of ten that we use to filter the ticks
    ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    labelledTicks: [50]
  },
  {
    length: 101, // behaves the same as the previous case
    ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    labelledTicks: [50]
  },
  {
    length: 103, // as previous case, but includes the last tick
    ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // notice the last tick is the same as the power of ten
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

describe('featureLengthAxisHelper', () => {
  describe('getTicks', () => {
    const width = 600;

    const generateScale = (length: number) =>
      scaleLinear().domain([1, length]).range([0, width]);

    it('produces expected labelled ticks', () => {
      for (const example of examples) {
        const scale = generateScale(example.length);
        const { ticks, labelledTicks } = getTicks(scale);
        expect(ticks).toEqual(example.ticks);
        expect(labelledTicks).toEqual(example.labelledTicks);
      }
    });
  });
});
