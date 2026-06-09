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

const forwardStrandNucleotides = 'ACGTURYWSMKBDHVNXacgturywsmkbdhvnx';
const reverseStrandNucleotides = 'TGCAAYRWSKMVHDBNXtgcaayrwskmvhdbnx';

const forwardToReverseStrandMap: Map<string, string> = new Map();

forwardStrandNucleotides.split('').forEach((character, index) => {
  forwardToReverseStrandMap.set(character, reverseStrandNucleotides[index]);
});

export const getReverseComplement = (sequence: string) =>
  sequence
    .split('')
    .map((character) => forwardToReverseStrandMap.get(character) as string)
    .reverse()
    .join('');

/**
 * A function for taking slices of a sequence.
 * Can be used either with coordinates from a longer sequence
 * (e.g., here is a sequence that starts at position 10,000;
 * give me its slice from position 10,010 to position 10,100),
 * and with the coordinates of a slice relative to this sequence
 * (e.g., here is a sequence; give me its slice that starts at position 10 and ends at position 100).
 *
 * The generated slice can be a reverse complement to the original sequence if desired
 */
export const getSequenceSlice = ({
  sequence,
  sequenceStart = 1,
  sliceStart,
  sliceEnd,
  reverseComplement = false
}: {
  sequence: string; // 5' to 3'
  sequenceStart?: number; // in Ensembl 1-based coordinates
  // sequenceEnd?: number; // in Ensembl 1-based coordinates
  sliceStart: number; // in Ensembl 1-based coordinates; relative to the 5' end of the sequence
  sliceEnd: number; // in Ensembl 1-based coordinates; relative to the 5' end of the sequence
  reverseComplement?: boolean;
}) => {
  const startIndex = sliceStart - sequenceStart;
  const endIndex = sliceEnd - sequenceStart;

  const slice = sequence.slice(startIndex, endIndex + 1);

  return reverseComplement ? getReverseComplement(slice) : slice;
};
