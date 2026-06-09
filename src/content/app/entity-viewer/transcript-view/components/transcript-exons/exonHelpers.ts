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

import { LINE_LENGTH } from 'src/shared/helpers/formatters/fastaFormatter';

const MID_PORTION_LENGTH = 10;

const NUM_CHARACTERS_END = LINE_LENGTH / 2 - MID_PORTION_LENGTH / 2;

/*
Rules about collapsed sequence strings:
- They are no longer than LINE_LENGTH characters
- They consist of a bit of sequence from the start,
  a bit of sequence from the end, and a skipped segment
  that is represented by dots
- The number of dots in the middle part is no more than
  MID_PORTION_LENGTH
- For cases where the sequence is between LINE_LENGTH and
  LINE_LENGTH + MID_PORTION_LENGTH, fill the middle with an
  appropriate calculated number of dots
*/

const middleDots = Array(MID_PORTION_LENGTH).fill('.').join('');

export const collapseSequence = (sequence: string) => {
  if (sequence.length <= LINE_LENGTH) {
    return sequence;
  } else if (sequence.length >= LINE_LENGTH + MID_PORTION_LENGTH) {
    // majority of cases
    const start = sequence.slice(0, NUM_CHARACTERS_END);
    const end = sequence.slice(sequence.length - NUM_CHARACTERS_END);
    return `${start}${middleDots}${end}`;
  } else {
    // need to calculate the number of dots in the middle,
    // as well as the length of characters in the start and end sections
    const halfLineLength = LINE_LENGTH / 2;
    const extraCharactersCount = sequence.length - LINE_LENGTH;
    const leftHalfExtraCharsCount = Math.ceil(extraCharactersCount / 2);
    const rightHalfExtraCharsCount = Math.floor(extraCharactersCount / 2);

    const leftSeqLength = halfLineLength - leftHalfExtraCharsCount;
    const rightSeqStartIndex =
      sequence.length - halfLineLength + rightHalfExtraCharsCount;

    const leftSeq = sequence.slice(0, leftSeqLength);
    const rightSeq = sequence.slice(rightSeqStartIndex);
    const middleDots = new Array(extraCharactersCount).fill('.').join('');
    return `${leftSeq}${middleDots}${rightSeq}`;
  }
};
