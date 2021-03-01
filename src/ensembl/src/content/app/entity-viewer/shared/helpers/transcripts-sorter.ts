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
import { Pick2 } from 'ts-multipick';

import {
  getFeatureLength,
  isProteinCodingTranscript,
  getSplicedRNALength,
  IsProteinCodingTranscriptParam,
  GetSplicedRNALengthParam
} from './entity-helpers';

import { SortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { Slice } from 'src/shared/types/thoas/slice';

type SliceWithOnlyLength = Pick2<Slice, 'location', 'length'>;

function compareTranscriptLengths(
  transcriptOne: { slice: SliceWithOnlyLength },
  transcriptTwo: { slice: SliceWithOnlyLength }
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

export function defaultSort<
  T extends Array<
    IsProteinCodingTranscriptParam & {
      slice: SliceWithOnlyLength;
      so_term: string;
    }
  >
>(transcripts: T): T {
  const [proteinCodingTranscripts, nonProteinCodingTranscripts] = partition(
    transcripts,
    isProteinCodingTranscript
  );
  proteinCodingTranscripts.sort(compareTranscriptLengths);

  const sortedNonProteinCodingTranscripts = sortBy(
    nonProteinCodingTranscripts,
    ['so_term']
  );

  return [
    ...proteinCodingTranscripts,
    ...sortedNonProteinCodingTranscripts
  ] as T;
}

export function sortBySplicedLengthDesc<T extends GetSplicedRNALengthParam[]>(
  transcripts: T
) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return getSplicedRNALength(transcriptB) - getSplicedRNALength(transcriptA);
  });
}

export function sortBySplicedLengthAsc<T extends GetSplicedRNALengthParam[]>(
  transcripts: T
) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return getSplicedRNALength(transcriptA) - getSplicedRNALength(transcriptB);
  });
}

export function sortByExonCountDesc<
  T extends Array<{ spliced_exons: unknown[] }>
>(transcripts: T) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return transcriptB.spliced_exons.length - transcriptA.spliced_exons.length;
  });
}

export function sortByExonCountAsc<
  T extends Array<{ spliced_exons: unknown[] }>
>(transcripts: T) {
  return [...transcripts].sort((transcriptA, transcriptB) => {
    return transcriptA.spliced_exons.length - transcriptB.spliced_exons.length;
  });
}

type GeneViewSortableTranscript = IsProteinCodingTranscriptParam &
  GetSplicedRNALengthParam & {
    so_term: string;
    slice: SliceWithOnlyLength;
    spliced_exons: unknown[];
  };

type SortingFunction<T extends GeneViewSortableTranscript> = (
  transcript: T[]
) => T[];

export const transcriptSortingFunctions: Record<
  SortingRule,
  SortingFunction<GeneViewSortableTranscript>
> = {
  default: defaultSort,
  spliced_length_desc: sortBySplicedLengthDesc,
  spliced_length_asc: sortBySplicedLengthAsc,
  exon_count_desc: sortByExonCountDesc,
  exon_count_asc: sortByExonCountAsc
};
