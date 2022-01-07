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

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

/**
 * Allowed inputs:
 *
 * - bare sequence
 * - bare sequence with numbered lines
 * - bare sequences separated by empty lines
 * - FASTA-formatted sequence
 * - FASTA-formatted multiple sequences (separated by header lines)
 * - FASTA-formatted sequences separated by empty lines
 *
 * Also:
 * - if a sequence contains spaces, remove them
 * - make sure all sequence characters are upper-cased
 */

export const parseBlastInput = (input: string) => {
  input = input.trim();

  const sequences: ParsedInputSequence[] = [];
  let newSequence = createEmptySequence();

  const lines = input.split('\n');

  lines.forEach((line) => {
    line = prepareLine(line);

    if (
      isSequenceSeparator(line) &&
      (newSequence.value || newSequence.header)
    ) {
      addToSequences(newSequence, sequences);
      newSequence = createEmptySequence();
    }

    if (line.startsWith('>')) {
      // this is a FASTA header line indicating the beginning of a new sequence
      line = line.replace(/^\>\s*/, '');
      newSequence.header = line; // remove the leading ">" from the header line
    } else {
      newSequence.value += line;
    }
  });

  addToSequences(newSequence, sequences);

  return sequences;
};

const prepareLine = (line: string) => {
  line = line.trim();

  if (line.startsWith('>')) {
    // this is a FASTA header; return it as is
    return line;
  }

  // remove all digits and spaces from the line
  line = line.replace(/[\d\s]+/g, '');
  return line.toUpperCase();
};

const isSequenceSeparator = (line: string) => {
  return line.startsWith('>') || line === '';
};

const createEmptySequence = (): ParsedInputSequence => ({ value: '' });

const addToSequences = (
  sequence: ParsedInputSequence,
  sequences: ParsedInputSequence[]
) => {
  if (sequence.value || sequence.header) {
    sequences.push(sequence);
  }
};
