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
import times from 'lodash/times';

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
  it('formats a raw sequence with a header into the FASTA format', () => {
    const sequenceLength = random(1, 600);
    const header = times(
      10,
      () => 'This is a long, repeated header string! '
    ).join();
    const rawSequence = generateSequence(sequenceLength);
    const fastaFormattedSequence = toFasta({ header, value: rawSequence });

    const [firstLine, ...sequenceLines] = fastaFormattedSequence.split('\n');
    expect(firstLine).toBe(`>${header}`);
    expect(
      sequenceLines.every((line) => line.length <= LINE_LENGTH)
    ).toBeTruthy();
    expect(sequenceLines.join('')).toBe(rawSequence);
  });

  it('formats a raw sequence without a header into the FASTA format', () => {
    const sequenceLength = random(1, 600);
    const rawSequence = generateSequence(sequenceLength);
    const formattedSequence = toFasta({ value: rawSequence });

    expect(formattedSequence.includes('>')).toBe(false);
    expect(formattedSequence.replaceAll('\n', '')).toEqual(rawSequence);
  });

  it('respects the line length option', () => {
    const header = times(
      10,
      () => 'This is a long, repeated header string! '
    ).join();
    const sequenceLength = 100;
    const rawSequence = generateSequence(sequenceLength);

    const lineLength = 10;

    const formattedSequence = toFasta(
      { header, value: rawSequence },
      { lineLength }
    );
    formattedSequence.split('\n').forEach((line, index) => {
      if (index === 0) {
        // first line should be unmodified header
        expect(line).toBe(`>${header}`);
      } else {
        expect(line.length).toBeLessThanOrEqual(lineLength);
      }
    });
  });
});
