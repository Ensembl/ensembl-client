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

import {
  getFeatureLength,
  isProteinCodingTranscript,
  getSplicedRNALength
} from './entity-helpers';

import { SortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

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

export function sortBySplicedLengthLongestToShortest(
  transcripts: Transcript[]
) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return getSplicedRNALength(transcriptB) - getSplicedRNALength(transcriptA);
  });
}

export function sortBySplicedLengthShortestToLongest(
  transcripts: Transcript[]
) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return getSplicedRNALength(transcriptA) - getSplicedRNALength(transcriptB);
  });
}

export function sortByExonCountHightToLow(transcripts: Transcript[]) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return transcriptB.spliced_exons.length - transcriptA.spliced_exons.length;
  });
}

export function sortByExonCountLowToHigh(transcripts: Transcript[]) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return transcriptA.spliced_exons.length - transcriptB.spliced_exons.length;
  });
}

type SortingFunction = (transcripts: Transcript[]) => Transcript[];
export const transcriptSortingFunctions: Record<
  SortingRule,
  SortingFunction
> = {
  default: defaultSort,
  spliced_length_longest_to_shortest: sortBySplicedLengthLongestToShortest,
  spliced_length_shortest_to_longest: sortBySplicedLengthShortestToLongest,
  exon_count_high_to_low: sortByExonCountHightToLow,
  exon_count_low_to_high: sortByExonCountLowToHigh
};
