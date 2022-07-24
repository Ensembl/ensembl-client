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
const QUERY_LINE_TITLE = 'Query';
const HIT_LINE_TITLE = 'Sbjct';

type Params = {
  querySequence: string;
  hitSequence: string;
  alignmentLine: string;
  queryStart: number;
  queryEnd: number;
  hitStart: number;
  hitEnd: number;
  queryLineTitle?: string;
  hitLineTitle?: string;
  alignmentLineLength?: number;
};

export const createBlastSequenceAlignment = (params: Params) => {
  const {
    querySequence,
    queryStart,
    hitStart,
    alignmentLineLength = ALIGNMENT_LINE_LENGTH
  } = params;

  let cursor = 0;
  let querySequenceCounter = queryStart;
  let hitSequenceCounter = hitStart;
  let fullAlignment = '';

  while (cursor < querySequence.length) {
    const result = createAlignedSegment({
      ...params,
      cursor,
      querySequenceCounter,
      hitSequenceCounter
    });
    const segment = result.segment;
    querySequenceCounter = result.querySequenceCounter;
    hitSequenceCounter = result.hitSequenceCounter;

    fullAlignment += '\n\n';
    fullAlignment += segment;
    cursor += alignmentLineLength;
  }

  return fullAlignment;
};

const createAlignedSegment = (
  params: Params & {
    cursor: number;
    querySequenceCounter: number;
    hitSequenceCounter: number;
  }
) => {
  const {
    querySequence,
    hitSequence,
    alignmentLine,
    hitStart,
    hitEnd,
    queryLineTitle = QUERY_LINE_TITLE,
    hitLineTitle = HIT_LINE_TITLE,
    alignmentLineLength = ALIGNMENT_LINE_LENGTH,
    querySequenceCounter,
    hitSequenceCounter,
    cursor
  } = params;

  const strandMultiplier = hitEnd > hitStart ? 1 : -1;

  const startIndex = cursor;
  const endIndex =
    querySequence.length - cursor > alignmentLineLength
      ? cursor + alignmentLineLength
      : querySequence.length - 1;

  const querySequenceSlice = querySequence.slice(startIndex, endIndex);
  const alignmentSlice = alignmentLine.slice(startIndex, endIndex);
  const hitSequenceSlice = hitSequence.slice(startIndex, endIndex);

  let queryLinePrefix = `${queryLineTitle} ${querySequenceCounter}`;
  let hitLinePrefix = `${hitLineTitle} ${hitSequenceCounter}`;

  const prefixLength = Math.max(queryLinePrefix.length, hitLinePrefix.length);

  queryLinePrefix = queryLinePrefix.padStart(prefixLength, ' ');
  hitLinePrefix = hitLinePrefix.padStart(prefixLength, ' ');
  const alignmentPrefix = ''.padStart(prefixLength, ' ');

  const updatedQuerySequenceCounter = calculateEndPosition({
    sequence: querySequence,
    startIndex,
    endIndex,
    startPosition: querySequenceCounter,
    strandMultiplier: 1
  });

  const updatedHitSequenceCounter = calculateEndPosition({
    sequence: hitSequence,
    startIndex,
    endIndex,
    startPosition: hitSequenceCounter,
    strandMultiplier
  });
  const queryLineSuffix = `${updatedQuerySequenceCounter}`;
  const hitLineSuffix = `${updatedHitSequenceCounter}`;

  const segment = [
    `${queryLinePrefix} ${querySequenceSlice} ${queryLineSuffix}`,
    `${alignmentPrefix} ${alignmentSlice}`,
    `${hitLinePrefix} ${hitSequenceSlice} ${hitLineSuffix}`
  ].join('\n');

  return {
    segment,
    querySequenceCounter: updatedQuerySequenceCounter,
    hitSequenceCounter: updatedHitSequenceCounter
  };
};

const calculateEndPosition = ({
  sequence,
  startIndex,
  endIndex,
  startPosition,
  strandMultiplier
}: {
  sequence: string;
  startIndex: number;
  endIndex: number;
  startPosition: number;
  strandMultiplier: number;
}) => {
  let position = startPosition;

  for (let i = startIndex; i < endIndex; i++) {
    if (sequence[i] !== '-') {
      position += 1 * strandMultiplier;
    }
  }

  return position;
};
