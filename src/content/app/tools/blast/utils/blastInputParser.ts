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
 * - if a sequence contains spaces, interpret them as just a formatting tool
 *   and remove them
 * - all sequence characters will be upper-cased
 */

export const parseBlastInput = (input: string) => {
  input = input.trim();

  const sequences: ParsedInputSequence[] = [];

  const lines = input.split('\n');

  lines.forEach((line, index) => {
    line = prepareLine(line);

    if (line.startsWith('>')) {
      // this is a FASTA header line indicating the beginning of a new sequence
      if (endsInEmptySequenceObject(sequences)) {
        const sequenceObject = sequences[sequences.length - 1];
        sequenceObject.header = line;
      } else {
        const newSequence = createEmptySequence();
        newSequence.header = line;
        sequences.push(newSequence);
      }
    } else if (line === '' && lines[index - 1] !== '') {
      // interpret it as a sequence separator, and create a new sequence
      const newSequence = createEmptySequence();
      sequences.push(newSequence);
    } else {
      if (index === 0) {
        // this is the first line of a bare sequence; create the sequence object first
        const newSequence = createEmptySequence();
        sequences.push(newSequence);
      }
      const sequenceObject = sequences[sequences.length - 1];
      sequenceObject.value += line;
    }
  });

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

const endsInEmptySequenceObject = (sequences: ParsedInputSequence[]) => {
  if (!sequences.length) {
    return false;
  }
  const lastSequenceObject = sequences[sequences.length - 1];
  return !lastSequenceObject.header && !lastSequenceObject.value;
};

const createEmptySequence = (): ParsedInputSequence => ({ value: '' });
