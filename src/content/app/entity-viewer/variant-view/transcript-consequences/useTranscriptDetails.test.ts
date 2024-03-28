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

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';

import {
  getDistanceToSliceStart,
  getDistanceToSliceEnd,
  getLeftFlankingGenomicSequence,
  getRightFlankingGenomicSequence,
  getReferenceAlleleGenomicSequence,
  getProteinSliceCoordinates
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

  test('Insertion, forward strand', () => {
    /**
     * Diagram (asterisk is the anchor base):
     * |--------------------*--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 201,
        variantLength: 0,
        transcriptStart: 101,
        strand: 'forward'
      })
    ).toBe(20);
  });

  test('Insertion, reverse strand', () => {
    /**
     * Diagram (asterisk is the anchor base):
     * |--------------------*--------------------|
     */

    expect(
      getDistanceToSliceStart({
        variantStart: 201,
        variantLength: 0,
        transcriptStart: 101,
        strand: 'reverse'
      })
    ).toBe(20);
  });

  test('Long variant, far from transcript start', () => {
    expect(
      getDistanceToSliceStart({
        variantStart: 45988418,
        variantLength: 48,
        transcriptStart: 45981770,
        strand: 'forward'
      })
    ).toBe(10);
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

  test('Insertion, forward strand', () => {
    /**
     * Diagram (asterisk is the anchor base):
     * |--------------------*--------------------|
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 201,
        variantLength: 0,
        transcriptEnd: 300,
        strand: 'forward'
      })
    ).toBe(21);
  });

  test('Insertion, reverse strand', () => {
    /**
     * Diagram (asterisk is the anchor base):
     * |--------------------*--------------------|
     */

    expect(
      getDistanceToSliceEnd({
        variantStart: 201,
        variantLength: 0,
        transcriptEnd: 300,
        strand: 'reverse'
      })
    ).toBe(21);
  });

  test('Long variant, far from transcript end', () => {
    expect(
      getDistanceToSliceEnd({
        variantStart: 45988418,
        variantLength: 48,
        transcriptEnd: 46005048,
        strand: 'forward'
      })
    ).toBe(10);
  });
});

describe('functions splitting genomic sequence into parts', () => {
  test('SNV, middle of sequence, forward strand', () => {
    const sequence = 'TGGAAGGGACGGCGGGGTCCAGCAGGCAGGCTCCGGCCGTG'; // 41 characters; SNV will be in the middle

    const expectedLeftFlankingSeq = 'TGGAAGGGACGGCGGGGTCC'; // first 20 characters
    const expectedVariantSeq = 'A';
    const expectedRightFlankingSeq = 'GCAGGCAGGCTCCGGCCGTG'; // last 20 characters

    expect(
      getLeftFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 20,
        distanceToSliceEnd: 20,
        strand: 'forward'
      })
    ).toBe(expectedLeftFlankingSeq);
    expect(
      getRightFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 20,
        distanceToSliceEnd: 20,
        strand: 'forward'
      })
    ).toBe(expectedRightFlankingSeq);
    expect(
      getReferenceAlleleGenomicSequence({
        sequence,
        distanceToSliceStart: 20,
        distanceToSliceEnd: 20,
        strand: 'forward'
      })
    ).toBe(expectedVariantSeq);
  });

  test('SNV, middle of sequence, reverse strand', () => {
    const sequence = 'TGGAAGGGACGGCGGGGTCCAGCAGGCAGGCTCCGGCCGTG'; // 41 characters; SNV will be in the middle

    const expectedLeftFlankingSeq = getReverseComplement(
      'GCAGGCAGGCTCCGGCCGTG'
    ); // reverse complement of last 20 characters
    const expectedVariantSeq = 'T'; // reverse complement of forward strand
    const expectedRightFlankingSeq = getReverseComplement(
      'TGGAAGGGACGGCGGGGTCC'
    ); // reverse complement of first 20 characters

    expect(
      getLeftFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 20,
        distanceToSliceEnd: 20,
        strand: 'reverse'
      })
    ).toBe(expectedLeftFlankingSeq);
    expect(
      getRightFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 20,
        distanceToSliceEnd: 20,
        strand: 'reverse'
      })
    ).toBe(expectedRightFlankingSeq);
    expect(
      getReferenceAlleleGenomicSequence({
        sequence,
        distanceToSliceStart: 20,
        distanceToSliceEnd: 20,
        strand: 'reverse'
      })
    ).toBe(expectedVariantSeq);
  });

  test('Insertion, near forward-strand start, forward strand', () => {
    const sequence = 'GCGGGGTCCAGCAGGCAGGCTCCGGCCGTG'; // 30 characters

    const expectedLeftFlankingSeq = 'GCGGGGTCC'; // first 9 characters
    const expectedVariantSeq = '';
    const expectedRightFlankingSeq = 'AGCAGGCAGGCTCCGGCCGTG'; // 21 characters

    expect(
      getLeftFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 9,
        distanceToSliceEnd: 21,
        strand: 'forward'
      })
    ).toBe(expectedLeftFlankingSeq);
    expect(
      getRightFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 9,
        distanceToSliceEnd: 21,
        strand: 'forward'
      })
    ).toBe(expectedRightFlankingSeq);
    expect(
      getReferenceAlleleGenomicSequence({
        sequence,
        distanceToSliceStart: 9,
        distanceToSliceEnd: 21,
        strand: 'forward'
      })
    ).toBe(expectedVariantSeq);
  });

  test('Insertion, near forward-strand start, reverse strand', () => {
    const sequence = 'GCGGGGTCCAGCAGGCAGGCTCCGGCCGTG'; // 30 characters

    const expectedLeftFlankingSeq = getReverseComplement(
      'AGCAGGCAGGCTCCGGCCGTG'
    ); // reverse complement of last 21 characters
    const expectedVariantSeq = '';
    const expectedRightFlankingSeq = getReverseComplement('GCGGGGTCC'); // reverse complement of first 9 characters

    expect(
      getLeftFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 9,
        distanceToSliceEnd: 21,
        strand: 'reverse'
      })
    ).toBe(expectedLeftFlankingSeq);
    expect(
      getRightFlankingGenomicSequence({
        sequence,
        distanceToSliceStart: 9,
        distanceToSliceEnd: 21,
        strand: 'reverse'
      })
    ).toBe(expectedRightFlankingSeq);
    expect(
      getReferenceAlleleGenomicSequence({
        sequence,
        distanceToSliceStart: 9,
        distanceToSliceEnd: 21,
        strand: 'reverse'
      })
    ).toBe(expectedVariantSeq);
  });
});

describe('getProteinSliceCoordinates', () => {
  test('short variant near the start of protein, even length', () => {
    expect(
      getProteinSliceCoordinates({
        variantStart: 2,
        variantEnd: 5,
        proteinLength: 100
      })
    ).toEqual({
      proteinSliceStart: 1,
      proteinSliceEnd: 24,
      distanceToProteinSliceStart: 1,
      distanceToProteinSliceEnd: 19
    });
  });

  test('short variant near the start of protein, odd length', () => {
    expect(
      getProteinSliceCoordinates({
        variantStart: 3,
        variantEnd: 7,
        proteinLength: 180
      })
    ).toEqual({
      proteinSliceStart: 1,
      proteinSliceEnd: 25,
      distanceToProteinSliceStart: 2,
      distanceToProteinSliceEnd: 18
    });
  });

  test('short variant, far from both the start and the end of protein, even length', () => {
    expect(
      getProteinSliceCoordinates({
        variantStart: 31,
        variantEnd: 34,
        proteinLength: 100
      })
    ).toEqual({
      proteinSliceStart: 13,
      proteinSliceEnd: 53,
      distanceToProteinSliceStart: 18,
      distanceToProteinSliceEnd: 19
    });
  });

  test('short variant, near the end of protein, even length', () => {
    expect(
      getProteinSliceCoordinates({
        variantStart: 93,
        variantEnd: 96,
        proteinLength: 100
      })
    ).toEqual({
      proteinSliceStart: 75,
      proteinSliceEnd: 100,
      distanceToProteinSliceStart: 18,
      distanceToProteinSliceEnd: 4
    });
  });
});
