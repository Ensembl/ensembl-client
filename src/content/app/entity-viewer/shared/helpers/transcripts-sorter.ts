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

import { Pick2 } from 'ts-multipick';

import {
  getSplicedRNALength,
  type IsProteinCodingTranscriptParam,
  type GetSplicedRNALengthParam
} from './entity-helpers';

import { SortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import type { Slice } from 'src/shared/types/core-api/slice';

type SliceWithOnlyLength = Pick2<Slice, 'location', 'length'>;

// Passthrough
export function defaultSort<T extends Array<unknown>>(transcripts: T): T {
  return transcripts;
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

export type GeneViewSortableTranscript = IsProteinCodingTranscriptParam &
  GetSplicedRNALengthParam & {
    slice: SliceWithOnlyLength;
    spliced_exons: unknown[];
  };

type SortingFunction<T extends GeneViewSortableTranscript> = (
  transcript: T[]
) => T[];

const transcriptSortingFunctions: Record<
  SortingRule,
  SortingFunction<GeneViewSortableTranscript>
> = {
  default: defaultSort,
  spliced_length_desc: sortBySplicedLengthDesc,
  spliced_length_asc: sortBySplicedLengthAsc,
  exon_count_desc: sortByExonCountDesc,
  exon_count_asc: sortByExonCountAsc
};

export const getTranscriptSortingFunction = <
  T extends GeneViewSortableTranscript
>(
  rule: SortingRule
): SortingFunction<T> => {
  return transcriptSortingFunctions[rule] as unknown as SortingFunction<T>; // typescript complains here; so forcing the type
};
