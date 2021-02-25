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

import { toFasta, LINE_LENGTH } from './fastaFormatter';
import random from 'lodash/random';

const generateSequence = (length: number) => {
  const alphabet = 'AGCT';
  let sequence = '';
  for (let i = 0; i <= length; i++) {
    const characterIndex = Math.floor(Math.random() * alphabet.length);
    const character = alphabet[characterIndex];
    sequence += character;
  }
  return sequence;
};

describe('fasta formatter', () => {
  it('formats raw sequence in the fasta format', () => {
    const sequenceLength = random(1, 600);
    const sequenceLabel = 'label for the sequence';
    const rawSequence = generateSequence(sequenceLength);
    const fastaFormattedSequence = toFasta(sequenceLabel, rawSequence);

    const [firstLine, ...sequenceLines] = fastaFormattedSequence.split('\n');
    expect(firstLine).toBe(`>${sequenceLabel}`);
    expect(sequenceLines.every((line) => line.length <= LINE_LENGTH));
    expect(sequenceLines.join('')).toBe(rawSequence);
  });
});
