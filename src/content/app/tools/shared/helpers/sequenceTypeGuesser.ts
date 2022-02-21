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

import difference from 'lodash/difference';

/**
  The nucleotide codes are:

    A --> adenine             M --> A C (amino)
    C --> cytosine            S --> G C (strong)
    G --> guanine             W --> A T (weak)
    T --> thymine             B --> G T C
    U --> uracil              D --> G A T
    R --> G A (purine)        H --> A C T
    Y --> T C (pyrimidine)    V --> G C A
    K --> G T (keto)          N --> A G C T (any)
                              -  gap of indeterminate length

  The amino acid codes allowed by BLASTP and TBLASTN programs are:

    A  alanine               P  proline
    B  aspartate/asparagine  Q  glutamine
    C  cystine               R  arginine
    D  aspartate             S  serine
    E  glutamate             T  threonine
    F  phenylalanine         U  selenocysteine
    G  glycine               V  valine
    H  histidine             W  tryptophan
    I  isoleucine            Y  tyrosine
    K  lysine                Z  glutamate/glutamine
    L  leucine               X  any
    M  methionine            *  translation stop
    N  asparagine            -  gap of indeterminate length

  (From NCBI Blast docs: https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp)
 */

const certainAminoAcids = 'ACDEFGHIKLMNPQRSTUVWY';
const ambiguousAminoAcids = 'XBZ';
const certainNucleotides = 'ACGTU';
const ambiguousNucleotides = 'BDHKMNRSVWY';

// While the amino acid alphabet includes all characters from the nucleotide alphabet,
// it also contains some characters that are unique to the amino acid alphabet
export const aminoAcidOnlyCodes = difference(
  `${certainAminoAcids}${ambiguousAminoAcids}`.split(''),
  `${certainNucleotides}${ambiguousNucleotides}`.split('')
).join('');

const aminoAcidOnlyRegex = new RegExp(`[${aminoAcidOnlyCodes}]`, 'i');

const certainNucleotidesSet = new Set(Array.from(certainNucleotides));

// guess the type of a single sequence
export const guessSequenceType = (sequence: string) => {
  sequence = cleanUpSequence(sequence);

  if (hasUniqueAminoAcidCharacters(sequence)) {
    return 'protein';
  }

  // an arbitrary threshold meaning that if 90% or more characters in a sequence
  // match unambiguous nucleotide characters, then guess that it's a nucleic acid
  const nucleotideThreshold = 0.9;

  const nucleotideCandidateCount = sequence
    .split('')
    .reduce(
      (count, character) =>
        certainNucleotidesSet.has(character) ? count + 1 : count,
      0
    );
  return nucleotideCandidateCount / sequence.length >= nucleotideThreshold
    ? 'dna'
    : 'protein';
};

// guess the type of multiple sequences assuming that they are of the same type
export const guessSequencesType = (sequences: string[]) => {
  return sequences.some((sequence) => guessSequenceType(sequence) === 'protein')
    ? 'protein'
    : 'dna';
};

const hasUniqueAminoAcidCharacters = (sequence: string) => {
  return aminoAcidOnlyRegex.test(sequence);
};

const cleanUpSequence = (sequence: string) => {
  // Remove the following from the sequence:
  // - any non-letter characters
  // - the letter N (could be an amino acid or a common ambiguous nucleotide code; will impact the threshold)
  // - the letter J (according to NCBI, not included in either the nucleotide or the amino acid alphabet)
  const cleanupRegExp = /[^A-Z]|[NJ]/gi;
  return sequence.replace(cleanupRegExp, '');
};
