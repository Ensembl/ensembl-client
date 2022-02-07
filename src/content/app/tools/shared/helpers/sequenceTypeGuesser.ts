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
 * The nucleic acid codes are:

    A --> adenine             M --> A C (amino)
    C --> cytosine            S --> G C (strong)
    G --> guanine             W --> A T (weak)
    T --> thymine             B --> G T C
    U --> uracil              D --> G A T
    R --> G A (purine)        H --> A C T
    Y --> T C (pyrimidine)    V --> G C A
    K --> G T (keto)          N --> A G C T (any)
                              -  gap of indeterminate length

 * The amino acid codes allowed by BLASTP and TBLASTN programs are:

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

/**
 * QUESTIONS:
 * Uniprot (see https://github.com/ebi-uniprot/franklin-sites/blob/main/src/sequence-utils/sequenceValidator.ts):
 * - Doesn't allow U as an amino acid code (although NCBI blast allows it as selenocysteine)
 * - Includes J (leucine or isoleucine) in the list of ambiguous amino acid codes, whereas NCBI doesn't list it among allowed amino acid codes
 *
 * Who is right?
 *
 *
 * Also, see old Ensembl code:
 * https://github.com/Ensembl/public-plugins/blob/release/105/tools/htdocs/components/20_BlastForm.js#L364
 */

const certainAminoAcids = 'ACDEFGHIKLMNPQRSTUVWY';
const ambiguousAminoAcids = 'XBZ';
const certainNucleotides = 'ACGTU';
const ambiguousNucleotides = 'BDHKMNRSVWY';

// TODO: three lines below are from Uniprot; check them
// Characters unique only to their subset e.g. 'U' is not a valid AA.
// const aminoAcidsOnly = /[EQILFPXJ]/gi;
// const nucleicAcidsOnly = /U/gi;

// FIXME: remove the eslint disable comment
/* eslint-disable @typescript-eslint/no-unused-vars */
const aminoAcidOnlyCodes = difference(
  `${certainAminoAcids}${ambiguousAminoAcids}`.split(''),
  `${certainNucleotides}${ambiguousNucleotides}`.split('')
).join('');

const nucleotideOnlyCodes = difference(
  `${certainNucleotides}${ambiguousNucleotides}`.split(''),
  `${certainAminoAcids}${ambiguousAminoAcids}`.split('')
).join('');

const certainNucleotidesSet = new Set(Array.from(certainNucleotides));

// FIXME: use SeuenceType

export const guessSequenceType = (sequence: string) => {
  // QUESTION: should we include testing for amino-acid-only codes in this function?
  sequence = cleanUpSequence(sequence);

  // an arbitrary threshold saying that if 90% or more characters in a sequence
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

const cleanUpSequence = (sequence: string) => {
  const cleanupRegExp = /[^A-Z]/gi; // anything that isn't a valid letter
  return sequence.replace(cleanupRegExp, '');
};

/*

export const validAminoAcids = [
  naturalAminoAcids,
  ambiguousAminoAcids,
  '*', // Stop
  '.-', // Gaps
].join('');

export const validNucleicAcids = [
  baseNucleicAcids,
  ambiguousNucleicAcids,
  // No gaps e.g. - and . are not allowed
].join('');

*/
