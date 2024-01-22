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

import { calculateSliceStart, calculateSliceEnd } from './useVariantImageData';

describe('calculateSliceStart', () => {
  describe('very short variants', () => {
    test('for a variant with a length of 1 nucleotide', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 101,
        variantLength: 1
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });

    test('for a variant with a length of 2 nucleotides', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 101,
        variantLength: 2
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });

    test('for a variant with a length of 3 nucleotides', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 100,
        variantLength: 3
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });

    test('for variant near region start', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 3,
        variantLength: 3
      });

      expect(sliceStart).toBe(1); // in 1-based coord system
    });
  });

  describe('close to max display length without truncation', () => {
    test('for a 20-nucleotide-long variant', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 92,
        variantLength: 20
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });

    test('for a 21-nucleotide-long variant', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 91,
        variantLength: 21
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });
  });

  describe('variants longer than max display length', () => {
    // NOTE: it should not matter how long the variant is;
    // the start of the ref sequence is always 10 nucleotides before

    test('for a 22-nucleotide-long variant', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 91,
        variantLength: 22
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });

    test('for a 200-nucleotide-long variant', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 91,
        variantLength: 200
      });

      expect(sliceStart).toBe(81); // in 1-based coord system
    });

    test('for a 200-nucleotide-long variant near region start', () => {
      const sliceStart = calculateSliceStart({
        variantStart: 5,
        variantLength: 200
      });

      expect(sliceStart).toBe(1); // never drop below the first nucleotide
    });
  });
});

describe('calculateSliceEnd', () => {
  describe('very short variants', () => {
    test('for a 1-nucleotide-long variant', () => {
      const sliceEnd = calculateSliceEnd({
        variantEnd: 101,
        variantLength: 1,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(121); // in 1-based coord system
    });

    test('for a 2-nucleotide-long variant', () => {
      // variant spans positions 101-102
      const sliceEnd = calculateSliceEnd({
        variantEnd: 102,
        variantLength: 2,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(121); // in 1-based coord system
    });

    test('for a 3-nucleotide-long variant', () => {
      // variant spans positions 100-102
      const sliceEnd = calculateSliceEnd({
        variantEnd: 102,
        variantLength: 3,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(121); // in 1-based coord system
    });
  });

  describe('close to max display length without truncation', () => {
    test('for a 20-nucleotide-long variant', () => {
      // variant spans positions 92-111
      const sliceEnd = calculateSliceEnd({
        variantEnd: 111,
        variantLength: 20,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(121); // in 1-based coord system
    });

    test('for a 21-nucleotide-long variant', () => {
      // variant spans positions 91-111
      const sliceEnd = calculateSliceEnd({
        variantEnd: 111,
        variantLength: 21,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(121); // in 1-based coord system
    });
  });

  describe('variants longer than max display length', () => {
    test('for a 22-nucleotide-long variant', () => {
      // variant spans positions 91-112
      const sliceEnd = calculateSliceEnd({
        variantEnd: 112,
        variantLength: 22,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(122); // in 1-based coord system
    });

    test('for a 200-nucleotide-long variant', () => {
      // variant spans positions 91-290
      const sliceEnd = calculateSliceEnd({
        variantEnd: 290,
        variantLength: 200,
        regionLength: 1_000_000 // irrelevantly long
      });

      expect(sliceEnd).toBe(300); // in 1-based coord system
    });

    test('for a 200-nucleotide-long variant near region end', () => {
      // variant spans positions 91-290
      const sliceEnd = calculateSliceEnd({
        variantEnd: 290,
        variantLength: 200,
        regionLength: 295 // irrelevantly long
      });

      expect(sliceEnd).toBe(295); // in 1-based coord system
    });
  });
});
