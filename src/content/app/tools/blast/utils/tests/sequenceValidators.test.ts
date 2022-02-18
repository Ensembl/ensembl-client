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
  isValidNucleotideSequence,
  isValidProteinSequence,
  hasValidSequenceCharacters
} from '../sequenceValidators';

const nucleotideSequence =
  'CGGACCAGACGGACACAGGGAGAAGCTAGTTTCTTTCATGTGATTGANATNATGACTCTACTCCTAAAAG';
const proteinSequence =
  'MENLNMDLLYMAAAVMMGLAAIGAAIGIGILGGKFLEGAARQPDLIPLLRTQFFIVMGLVDAIPMIAVGL';

describe('isValidNucleotideSequence', () => {
  it('reports a nucleotide sequence as valid', () => {
    expect(isValidNucleotideSequence(nucleotideSequence)).toBe(true);
  });

  it('reports a non-nucleotide sequence as invalid', () => {
    expect(isValidNucleotideSequence(proteinSequence)).toBe(false);
  });
});

describe('isValidProteinSequence', () => {
  it('reports a protein sequence as valid', () => {
    expect(isValidProteinSequence(proteinSequence)).toBe(true);
  });

  it('reports a nucleotide sequence as valid', () => {
    // nucleotide alphabet is a subset of amino acid alphabet
    expect(isValidProteinSequence(nucleotideSequence)).toBe(true);
  });

  it('reports a sequence containing out-of-alphabet characters as invalid', () => {
    expect(isValidProteinSequence(`${proteinSequence}J`)).toBe(false);
  });
});

describe('hasValidSequenceCharacters', () => {
  it('correctly reports valid sequences', () => {
    // for DNA
    expect(hasValidSequenceCharacters(nucleotideSequence, 'dna')).toBe(true);

    // for RNA (we aren't making a difference in the sequence type passed to the function)
    expect(
      hasValidSequenceCharacters(nucleotideSequence.replaceAll('T', 'U'), 'dna')
    ).toBe(true);

    // for RNA (we aren't making a difference in the sequence type passed to the function)
    expect(hasValidSequenceCharacters(proteinSequence, 'protein')).toBe(true);
  });

  it('correctly reports invalid sequences', () => {
    // for DNA
    expect(hasValidSequenceCharacters(proteinSequence, 'dna')).toBe(false);

    // for RNA (we aren't making a difference in the sequence type passed to the function)
    expect(hasValidSequenceCharacters(`${proteinSequence}J`, 'protein')).toBe(
      false
    );
  });
});
