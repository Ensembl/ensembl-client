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

import type { BlastAlignmentLine } from '../blastSequenceAlignmentHelper';

type LineLabelGetter = (position: number) => string;
type LineLabel = string | number | LineLabelGetter;

type Params = {
  alignmentLines: BlastAlignmentLine[];
  queryLineStartLabel?: LineLabel;
  queryLineEndLabel?: LineLabel;
  hitLineStartLabel?: LineLabel;
  hitLineEndLabel?: LineLabel;
};

// QUESTION: should we add numbers to the middle line (containing the ASCI art that connects the query line with the hit line?)

export const simpleStringBlastAlignmentFormatter = (params: Params) => {
  const { alignmentLines } = params;

  let result = '';

  for (const alignmentLine of alignmentLines) {
    result += formatAlignmentLine({
      ...params,
      alignmentLine
    });
    result += '\n\n';
  }

  return result;
};

const formatAlignmentLine = (
  params: Params & { alignmentLine: BlastAlignmentLine }
) => {
  const {
    alignmentLine,
    queryLineStartLabel,
    queryLineEndLabel,
    hitLineStartLabel,
    hitLineEndLabel
  } = params;

  const {
    queryLine,
    hitLine,
    alignmentLine: middleLine,
    queryLineStart,
    queryLineEnd,
    hitLineStart,
    hitLineEnd
  } = alignmentLine;

  let queryLinePrefix = getLabel(queryLineStart, queryLineStartLabel);
  const queryLineSuffix = getLabel(queryLineEnd, queryLineEndLabel);
  let hitLinePrefix = getLabel(hitLineStart, hitLineStartLabel);
  const hitLineSuffix = getLabel(hitLineEnd, hitLineEndLabel);

  const prefixLength = Math.max(queryLinePrefix.length, hitLinePrefix.length);
  queryLinePrefix = queryLinePrefix.padEnd(prefixLength, ' ');
  hitLinePrefix = hitLinePrefix.padEnd(prefixLength, ' ');

  const alignmentPrefix = ''.padStart(prefixLength, ' ');

  return [
    `${queryLinePrefix} ${queryLine} ${queryLineSuffix}`,
    `${alignmentPrefix} ${middleLine}`,
    `${hitLinePrefix} ${hitLine} ${hitLineSuffix}`
  ].join('\n');
};

const getLabel = (position: number, labelOrLabelGetter?: LineLabel): string => {
  if (!labelOrLabelGetter) {
    return `${position}`;
  } else if (labelOrLabelGetter instanceof Function) {
    return labelOrLabelGetter(position);
  } else {
    return `${labelOrLabelGetter}`;
  }
};
