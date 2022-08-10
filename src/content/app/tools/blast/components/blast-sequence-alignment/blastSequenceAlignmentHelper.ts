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

const ALIGNMENT_LINE_LENGTH = 60;

type Params = {
  querySequence: string;
  hitSequence: string;
  alignmentLine: string;
  queryStart: number;
  queryEnd: number;
  hitStart: number;
  hitEnd: number;
  alignmentLineLength?: number;
};

export type BlastAlignmentLine = {
  queryLineStart: number; // Position in the query sequence at the start of a line. To be used only for labelling purposes
  queryLineEnd: number; // Position in the query sequence at the end of a line. Excludes mismatches while counting. To be used only for labelling purposes
  hitLineStart: number; // Position in the matched sequence at the start of a line. To be used only for labelling purposes
  hitLineEnd: number; // Position in the matched sequence at the end of a line. Excludes mismatches while counting. To be used only for labelling purposes
  alignmentLineStart: number; // Counter starting from the first character of the first line of the alignment
  alignmentLineEnd: number; // Counter starting from the first character of the first line of the alignment
  queryLine: string; // Query sequence; may contain dashes for missing characters relative to hit sequence
  hitLine: string; // Matched sequence; may contain dashes for missing characters relative to query sequence
  alignmentLine: string; // Vertical line characters representing matches between the query and the target sequence
};

export const createBlastSequenceAlignment = (params: Params) => {
  const {
    querySequence,
    hitSequence,
    alignmentLine,
    queryStart,
    hitStart,
    hitEnd,
    alignmentLineLength = ALIGNMENT_LINE_LENGTH
  } = params;

  let cursor = 0;
  const hitDirection = hitEnd > hitStart ? 1 : -1;
  const alignedLines: BlastAlignmentLine[] = [];

  while (cursor < querySequence.length) {
    const lastAlignedSegment = alignedLines.at(-1);
    const nextQueryStartPosition = lastAlignedSegment?.queryLineEnd
      ? lastAlignedSegment?.queryLineEnd + 1 // start next line from the next nucleotide / amino acid
      : queryStart;
    const nextHitStartPosition = lastAlignedSegment?.hitLineEnd
      ? lastAlignedSegment?.hitLineEnd + hitDirection // start nest line from the next nucleotide / amino acid
      : hitStart;

    const alignedSegment = createAlignedSegment({
      queryStart: nextQueryStartPosition,
      hitStart: nextHitStartPosition,
      hitDirection,
      querySequence,
      hitSequence,
      alignmentLine,
      cursor
    });

    alignedLines.push(alignedSegment);
    cursor += alignmentLineLength;
  }

  return alignedLines;
};

const createAlignedSegment = (params: {
  querySequence: string;
  hitSequence: string;
  alignmentLine: string;
  hitDirection: number; // either 1 or - 1
  queryStart: number;
  hitStart: number;
  alignmentLineLength?: number;
  cursor: number;
}): BlastAlignmentLine => {
  const {
    querySequence,
    hitSequence,
    alignmentLine,
    hitDirection,
    queryStart,
    hitStart,
    alignmentLineLength = ALIGNMENT_LINE_LENGTH,
    cursor
  } = params;

  const startIndex = cursor;
  const endIndex =
    querySequence.length - cursor > alignmentLineLength
      ? cursor + alignmentLineLength - 1
      : querySequence.length - 1;

  const querySequenceSlice = querySequence.slice(startIndex, endIndex + 1);
  const alignmentSlice = alignmentLine.slice(startIndex, endIndex + 1);
  const hitSequenceSlice = hitSequence.slice(startIndex, endIndex + 1);

  const updatedQuerySequenceCounter = calculateEndPosition({
    sequence: querySequence,
    startIndex,
    endIndex,
    startPosition: queryStart,
    strandDirectionMultiplier: 1
  });

  const updatedHitSequenceCounter = calculateEndPosition({
    sequence: hitSequence,
    startIndex,
    endIndex,
    startPosition: hitStart,
    strandDirectionMultiplier: hitDirection
  });

  return {
    queryLineStart: queryStart,
    queryLineEnd: updatedQuerySequenceCounter,
    hitLineStart: hitStart,
    hitLineEnd: updatedHitSequenceCounter,
    alignmentLineStart: cursor + 1,
    alignmentLineEnd: cursor + alignmentLineLength,
    queryLine: querySequenceSlice,
    hitLine: hitSequenceSlice,
    alignmentLine: alignmentSlice
  };
};

const calculateEndPosition = ({
  sequence,
  startIndex,
  endIndex,
  startPosition,
  strandDirectionMultiplier
}: {
  sequence: string;
  startIndex: number;
  endIndex: number;
  startPosition: number;
  strandDirectionMultiplier: number;
}) => {
  let position = startPosition;

  for (let i = startIndex; i < endIndex; i++) {
    if (sequence[i] !== '-') {
      position += 1 * strandDirectionMultiplier;
    }
  }

  return position;
};
