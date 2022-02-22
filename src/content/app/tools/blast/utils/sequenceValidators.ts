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

import { aminoAcidAlphabet, nucleotideAlphabet } from './sequenceAlphabets';

import type { SequenceType } from 'src/content/app/tools/blast/types/blastSettings';

const MINIMUM_SEQUENCE_LENGTH = 5;

const notNucleotideRegex = new RegExp(`[^${nucleotideAlphabet}]`, 'i');
const notAminoAcidRegex = new RegExp(`[^${aminoAcidAlphabet}]`, 'i');

export const hasSufficientLength = (sequence: string) => {
  return sequence.length >= MINIMUM_SEQUENCE_LENGTH;
};

export const hasValidSequenceCharacters = (
  sequence: string,
  sequenceType: SequenceType
) => {
  return sequenceType === 'protein'
    ? isValidProteinSequence(sequence)
    : isValidNucleotideSequence(sequence);
};

export const isValidNucleotideSequence = (sequence: string) => {
  // check if sequence contains anything outside the nucleotide alphabet
  return !notNucleotideRegex.test(sequence);
};

export const isValidProteinSequence = (sequence: string) => {
  // check if sequence contains anything outside the amino acid alphabet
  return !notAminoAcidRegex.test(sequence);
};

export const isValidSequence = (
  sequence: string,
  sequenceType: SequenceType
) => {
  return (
    hasSufficientLength(sequence) &&
    hasValidSequenceCharacters(sequence, sequenceType)
  );
};
