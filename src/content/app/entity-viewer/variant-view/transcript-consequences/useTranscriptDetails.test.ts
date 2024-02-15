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
  getDistanceToSliceStart,
  getDistanceToSliceEnd
} from './useTranscriptDetails';

describe('getDistanceToSliceStart', () => {
  test('SNV, forward strand', () => {
    /**
     * - Single-nucleotide variant
     * - No anchor base
     * - Forward strand
     * - Far from the start of the transcript
     *
     * Diagram:
     * |--------------------*--------------------|
     *
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 200,
        variantLength: 1,
        transcriptStart: 100,
        strand: 'forward'
      })
    ).toBe(20);
  });

  test('SNV, reverse strand', () => {
    /**
     * Same as the previous example; but on the reverse strand
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 200,
        variantLength: 1,
        transcriptStart: 100,
        strand: 'reverse'
      })
    ).toBe(20);
  });

  test('Two-nucleotide variant, forward strand', () => {
    /**
     * Even-length nucleotide. Remember that bases that can't be symmetrically arranged around the middle
     * are placed closer to transcript relative start
     *
     * Diagram (19 slots to the left of the variant; 20 slots to the right):
     * |-------------------**--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 200,
        variantLength: 2,
        transcriptStart: 100,
        strand: 'forward'
      })
    ).toBe(19);
  });

  test('Two-nucleotide variant, reverse strand', () => {
    /**
     * Same as the previous example; but on the reverse strand
     *
     * Diagram:
     * |-------------------**--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 200,
        variantLength: 2,
        transcriptStart: 100,
        strand: 'reverse'
      })
    ).toBe(20);
  });

  test('Odd-length variant, close to transcript start, forward strand', () => {
    /**
     * Diagram:
     * |---------***--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 110,
        variantLength: 3,
        transcriptStart: 101,
        strand: 'forward'
      })
    ).toBe(9);
  });

  test('Odd-length variant, close to transcript start, reverse strand', () => {
    /**
     * Should be the same as on forward strand
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 110,
        variantLength: 3,
        transcriptStart: 101,
        strand: 'reverse'
      })
    ).toBe(9);
  });

  test('Even-length variant, close to transcript start, forward strand', () => {
    /**
     * Diagram:
     * |--------****--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 109,
        variantLength: 4,
        transcriptStart: 101,
        strand: 'forward'
      })
    ).toBe(8);
  });

  test('Even-length variant, close to transcript start, reverse strand', () => {
    /**
     * Should be the same as on forward strand (because the defining factor here is transcript start coordinate)
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 109,
        variantLength: 4,
        transcriptStart: 101,
        strand: 'reverse'
      })
    ).toBe(8);
  });

  test('Edge case: variant in the same position as transcript start', () => {
    /**
     * Does this make any biological sense? Probably not; but it is an edge case for code.
     *
     * Diagram:
     * |**--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 101,
        variantLength: 2,
        transcriptStart: 101,
        strand: 'forward'
      })
    ).toBe(0);
  });
});

describe('getDistanceToSliceEnd', () => {
  test('SNV, forward strand', () => {
    /**
     * Diagram:
     * |--------------------*--------------------|
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 200,
        variantLength: 1,
        transcriptEnd: 300,
        strand: 'forward'
      })
    ).toBe(20);
  });

  test('SNV, reverse strand', () => {
    /**
     * Same as the previous example; but for the reverse strand
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 200,
        variantLength: 1,
        transcriptEnd: 300,
        strand: 'reverse'
      })
    ).toBe(20);
  });

  test('Two-nucleotide variant, forward strand', () => {
    /**
     * Even-length nucleotide. Remember that bases that can't be symmetrically arranged around the middle
     * are placed closer to transcript relative start
     *
     * Diagram (19 slots to the left of the variant; 20 slots to the right):
     * |-------------------**--------------------|
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 200,
        variantLength: 2,
        transcriptEnd: 300,
        strand: 'forward'
      })
    ).toBe(20);
  });

  test('Two-nucleotide variant, reverse strand', () => {
    /**
     * Same as the previous example; but for the reverse strand
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 200,
        variantLength: 2,
        transcriptEnd: 300,
        strand: 'reverse'
      })
    ).toBe(19);
  });

  test('Odd-length variant, forward strand', () => {
    /**
     * Diagram:
     * |------------------*****------------------|
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 200,
        variantLength: 5,
        transcriptEnd: 300,
        strand: 'forward'
      })
    ).toBe(18);
  });

  test('Odd-length variant, reverse strand', () => {
    /**
     * Same as the previous example; but for the reverse strand
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 200,
        variantLength: 5,
        transcriptEnd: 300,
        strand: 'reverse'
      })
    ).toBe(18);
  });

  test('Odd-length variant, close to transcript end, forward strand', () => {
    /**
     * Diagram:
     * |------------------*****-----|
     */
    expect(
      getDistanceToSliceEnd({
        variantStart: 201,
        variantLength: 5,
        transcriptEnd: 210,
        strand: 'forward'
      })
    ).toBe(5);
  });

  test('Odd-length variant, close to transcript end, reverse strand', () => {
    /**
     * Same as above example, but for the reverse strand:
     * |------------------*****-----|
     */
    expect(
      getDistanceToSliceEnd({
        variantStart: 201,
        variantLength: 5,
        transcriptEnd: 210,
        strand: 'reverse'
      })
    ).toBe(5);
  });

  test('Even-length variant, close to transcript end, forward strand', () => {
    /**
     * Diagram:
     * |------------------****------|
     */
    expect(
      getDistanceToSliceEnd({
        variantStart: 201,
        variantLength: 4,
        transcriptEnd: 210,
        strand: 'forward'
      })
    ).toBe(6);
  });

  test('Even-length variant, close to transcript end, reverse strand', () => {
    /**
     * Diagram:
     * |------------------****------|
     */
    expect(
      getDistanceToSliceEnd({
        variantStart: 201,
        variantLength: 4,
        transcriptEnd: 210,
        strand: 'reverse'
      })
    ).toBe(6);
  });
});
