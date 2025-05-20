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
  getBinStartForPosition,
  getBinEndForPosition,
  createBins,
  BIN_SIZE
} from './binsHelper';

describe('getBinStartForPosition', () => {
  test('bins start BIN_SIZE * n + 1', () => {
    expect(getBinStartForPosition(1)).toBe(1);
    expect(getBinStartForPosition(10_000)).toBe(1);
    expect(getBinStartForPosition(BIN_SIZE)).toBe(1);
    expect(getBinStartForPosition(BIN_SIZE + 1)).toBe(BIN_SIZE + 1);
    expect(getBinStartForPosition(BIN_SIZE + 10_000)).toBe(BIN_SIZE + 1);
  });
});

describe('getBinEndForPosition', () => {
  test('bins end at BIN_SIZE * n', () => {
    expect(getBinEndForPosition(1)).toBe(BIN_SIZE);
    expect(getBinEndForPosition(10_000)).toBe(BIN_SIZE);
    expect(getBinEndForPosition(BIN_SIZE)).toBe(BIN_SIZE);
    expect(getBinEndForPosition(BIN_SIZE + 1)).toBe(BIN_SIZE * 2);
  });
});

describe('createBins', () => {
  it('creates a single bin for a location that falls within it', () => {
    const bins = createBins({ start: 10_000, end: 20_000 });
    expect(bins.length).toBe(1);

    const bin = bins[0];

    // expect the bin to be 1-1_000_000
    expect(bin.start).toBe(1);
    expect(bin.end).toBe(BIN_SIZE);
  });

  it('creates two bins for a location that crosses a bin boundary', () => {
    const bins = createBins({ start: 10_000, end: 1_001_000 });
    expect(bins.length).toBe(2);

    const [firstBin, secondBin] = bins;

    // expect the bin to be 1-1_000_000
    expect(firstBin.start).toBe(1);
    expect(firstBin.end).toBe(BIN_SIZE);

    // expect the bin to be 1_000_001-2_000_000
    expect(secondBin.start).toBe(BIN_SIZE + 1);
    expect(secondBin.end).toBe(BIN_SIZE * 2);
  });
});
