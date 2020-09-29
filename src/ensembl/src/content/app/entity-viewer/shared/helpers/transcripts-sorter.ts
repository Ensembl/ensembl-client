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

import sortBy from 'lodash/sortBy';
import partition from 'lodash/partition';

import { getFeatureLength, isProteinCodingTranscript } from './entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

function compareTranscriptLengths(
  transcriptOne: Transcript,
  transcriptTwo: Transcript
) {
  const transcriptOneLength = getFeatureLength(transcriptOne);
  const transcriptTwoLength = getFeatureLength(transcriptTwo);

  if (transcriptOneLength > transcriptTwoLength) {
    return -1;
  }

  if (transcriptOneLength < transcriptTwoLength) {
    return 1;
  }

  return 0;
}

export function defaultSort(transcripts: Transcript[]) {
  const [proteinCodingTranscripts, nonProteinCodingTranscripts] = partition(
    transcripts,
    isProteinCodingTranscript
  );
  proteinCodingTranscripts.sort(compareTranscriptLengths);

  const sortedNonProteinCodingTranscripts = sortBy(
    nonProteinCodingTranscripts,
    ['so_term']
  );

  return [...proteinCodingTranscripts, ...sortedNonProteinCodingTranscripts];
}
