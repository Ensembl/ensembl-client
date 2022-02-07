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

import { guessSequenceType } from './sequenceTypeGuesser';

describe('guessSequence', () => {
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

  it.skip('guesses a nucleotide sequence with ambiguous codes', () => {
    // This will be guessed as a protein although it's a nucleic acid
    // should we remove the N's as Uniprot does? What about other ambiguous nucleotide codes?
    const sequence = 'CCCNTTAAAGGGGGNNCCCCTNCNNGGGGGAATAAAACAANTTNNTTTTTT';
    expect(guessSequenceType(sequence)).toBe('dna');
  });
});
