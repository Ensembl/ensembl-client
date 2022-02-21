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
  guessSequenceType,
  guessSequencesType,
  aminoAcidOnlyCodes
} from './sequenceTypeGuesser';

describe('guessSequenceType', () => {
  it('guesses a protein sequence', () => {
    const sequence =
      'MENLNMDLLYMAAAVMMGLAAIGAAIGIGILGGKFLEGAARQPDLIPLLRTQFFIVMGLVDAIPMIAVGL';
    expect(guessSequenceType(sequence)).toBe('protein');
  });

  it('guesses a nucleotide sequence', () => {
    const sequence =
      'CGGACCAGACGGACACAGGGAGAAGCTAGTTTCTTTCATGTGATTGANATNATGACTCTACTCCTAAAAG';
    expect(guessSequenceType(sequence)).toBe('dna');
  });

  it('interprets sequence as protein if it contains one or more unique characters', () => {
    // amino acid alphabet contains the following letters not present in the nucleotide alphabet: EFILPQXZ
    aminoAcidOnlyCodes.split('').forEach((character) => {
      const sequence = `ACGTUACGTUACGTUACGTUACGTUACGTU${character}`;
      expect(guessSequenceType(sequence)).toBe('protein');
    });
  });

  it('ignores the ambiguous code N when guessing a nucleotide sequence', () => {
    // The letter N exists in both amino acid and nucleotide alphabets.
    // It is ignored while guessing a sequence type
    const sequence = 'CCCNTTAAAGGGGGNNCCCCTNCNNGGGGGAATAAAACAANTTNNTTTTTT';
    expect(guessSequenceType(sequence)).toBe('dna');
  });
});

describe('guessSequencesType', () => {
  const nucleotideSequence1 = 'ACACACTCACACACACTTGGTCAGAGATGCTGTGC';
  const nucleotideSequence2 = 'TNAAGCNTGACAACACCAGGCAGGTATGAGAGGAAAG';
  const proteinSequence1 =
    'QIKDLLVSSSTDLDTTLVLVNAIYFKGMWKTAFNAEDTREMPFHVTKQESKPVQMMCMNNSFNVATLPAE';
  const proteinSequence2 =
    'KMKILELPFASGDLSMLVLLPDEVSDLERIEKTINFEKLTEWTNPNTMEKRRVKVYLPQMKIEEKYNLTS';

  it('assumes all sequences to be DNA if none is guessed as protein', () => {
    const nucleotideSequences = [nucleotideSequence1, nucleotideSequence2];
    expect(guessSequencesType(nucleotideSequences)).toBe('dna');
  });

  it('assumes all sequences to be protein if none is guessed as DNA', () => {
    const proteinSequences = [proteinSequence1, proteinSequence2];
    expect(guessSequencesType(proteinSequences)).toBe('protein');
  });

  it('assumes all sequences to be protein if at least one is guessed as protein', () => {
    const mixedSequences = [
      nucleotideSequence1,
      nucleotideSequence2,
      proteinSequence1
    ];
    expect(guessSequencesType(mixedSequences)).toBe('protein');
  });
});
