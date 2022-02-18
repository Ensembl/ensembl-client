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

import difference from 'lodash/difference';

export const certainAminoAcids = 'ACDEFGHIKLMNPQRSTUVWY';
export const ambiguousAminoAcids = 'XBZ';
export const certainNucleotides = 'ACGTU';
export const ambiguousNucleotides = 'BDHKMNRSVWY';

export const aminoAcidAlphabet = [
  certainAminoAcids,
  ambiguousAminoAcids,
  '*', // Stop
  '-' // Gap
].join('');

export const nucleotideAlphabet = [
  certainNucleotides,
  ambiguousNucleotides,
  '-' // Gap
].join('');

// While the amino acid alphabet includes all characters from the nucleotide alphabet,
// it also contains some characters that are unique to the amino acid alphabet
export const aminoAcidOnlyCodes = difference(
  `${certainAminoAcids}${ambiguousAminoAcids}`.split(''),
  `${certainNucleotides}${ambiguousNucleotides}`.split('')
).join('');
