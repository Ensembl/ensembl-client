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

import { getReverseComplement, getSequenceSlice } from './sequenceHelpers';

describe('getReverseComplement', () => {
  it('generates a reverse complement for the provided sequence', () => {
    expect(getReverseComplement('ACCTTGAAA')).toBe('TTTCAAGGT');
  });
});

describe('getSequenceSlice', () => {
  test('forward strand, slice relative to the sequence', () => {
    const sequence = 'AGGCCAGCCGGCGCCATTTTGAAAGTGGAGTCGCCTGCCCCTGCCGCTGCCGCCGC';

    // from the beginning
    let slice = getSequenceSlice({ sequence, sliceStart: 1, sliceEnd: 10 });
    expect(slice.length).toBe(10);
    expect(slice).toBe(sequence.slice(0, 10));

    // from the middle
    slice = getSequenceSlice({ sequence, sliceStart: 11, sliceEnd: 25 });
    expect(slice.length).toBe(15);
    expect(slice).toBe(sequence.slice(10, 25));
  });

  test('reverse strand, slice relative to the sequence', () => {
    const sequence = 'AGGCCAGCCGGCGCCATTTTGAAAGTGGAGTCGCCTGCCCCTGCCGCTGCCGCCGC';

    // from the 5'-end of the sequence
    let slice = getSequenceSlice({
      sequence,
      sliceStart: 1,
      sliceEnd: 10,
      reverseComplement: true
    });
    expect(slice.length).toBe(10);
    expect(slice).toBe(getReverseComplement(sequence.slice(0, 10)));

    // from the middle
    slice = getSequenceSlice({
      sequence,
      sliceStart: 11,
      sliceEnd: 25,
      reverseComplement: true
    });
    expect(slice.length).toBe(15);
    expect(slice).toBe(getReverseComplement(sequence.slice(10, 25)));
  });

  test('forward strand, slice from a sequence providing its coordinates', () => {
    const sequence = 'CGCCGTCGCTGTCGTAGTCGCCGCCGCCGCTGCCGGAGAAAGAGCACGAGCGGGGA';

    const slice = getSequenceSlice({
      sequence,
      sequenceStart: 123_456,
      sliceStart: 123_461,
      sliceEnd: 123_470
    });
    expect(slice.length).toBe(10);
    expect(slice).toBe('TCGCTGTCGT');
  });

  test('reverse strand, slice from a sequence providing its coordinates', () => {
    const sequence = 'CGCCGTCGCTGTCGTAGTCGCCGCCGCCGCTGCCGGAGAAAGAGCACGAGCGGGGA';

    const slice = getSequenceSlice({
      sequence,
      sequenceStart: 123_456,
      sliceStart: 123_461, // i.e. should start from the sixth nucleotide of the sequence
      sliceEnd: 123_470,
      reverseComplement: true
    });
    expect(slice.length).toBe(10);
    expect(slice).toBe(getReverseComplement('TCGCTGTCGT'));
  });

  test('slice that is longer than the sequence', () => {
    // NOTE: these are edge cases that should never happen;
    const sequence = 'ACCTTGAAA'; // 9 nucleotides

    // start within the sequence
    let slice = getSequenceSlice({
      sequence,
      sliceStart: 5, // i.e. should start from the sixth nucleotide of the sequence
      sliceEnd: 20
    });
    expect(slice.length).toBe(5);
    expect(slice).toBe(sequence.slice(4));

    // same, but reverse complement
    slice = getSequenceSlice({
      sequence,
      sliceStart: 5, // i.e. should start from the sixth nucleotide of the sequence
      sliceEnd: 20,
      reverseComplement: true
    });
    expect(slice.length).toBe(5);
    expect(slice).toBe(getReverseComplement(sequence.slice(4)));

    // start outside the sequence
    slice = getSequenceSlice({
      sequence,
      sliceStart: 10, // while the sequence is only 9 nucleotides long
      sliceEnd: 20,
      reverseComplement: true
    });
    expect(slice).toBe('');
  });
});
