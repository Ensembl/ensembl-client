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

import partition from 'lodash/partition';
import { Pick2 } from 'ts-multipick';

import {
  getFeatureLength,
  isProteinCodingTranscript,
  getSplicedRNALength,
  type IsProteinCodingTranscriptParam,
  type GetSplicedRNALengthParam
} from './entity-helpers';

import { SortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import type { Slice } from 'src/shared/types/thoas/slice';
import type { ProductType } from 'src/shared/types/thoas/product';

type SliceWithOnlyLength = Pick2<Slice, 'location', 'length'>;
type DefaultSortTranscript = {
  metadata: {
    canonical: Record<string, unknown> | null;
    biotype: { value: string };
    mane: Record<string, unknown> | null;
  };
  product_generating_contexts: Array<{
    product_type: ProductType;
    product: { length: number } | null;
  }>;
  slice: { location: { length: number } };
};

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

const isCanonical = (transcript: {
  metadata: { canonical: Record<string, unknown> | null };
}) => Boolean(transcript.metadata.canonical);

const isManeTranscript = (transcript: {
  metadata: { mane: Record<string, unknown> | null };
}) => Boolean(transcript.metadata.mane);

export function defaultSort<T extends Array<DefaultSortTranscript>>(
  transcripts: T
): T {
  const [ensemblCanonicalTranscript, nonCanonicalTranscripts] = partition(
    transcripts,
    isCanonical
  );

  const [maneTranscripts, otherTranscripts] = partition(
    nonCanonicalTranscripts,
    isManeTranscript
  );

  const [proteinCodingTranscripts, nonProteinCodingTranscripts] = partition(
    otherTranscripts,
    isProteinCodingTranscript
  );

  sortProteinCodingTranscripts(proteinCodingTranscripts);
  nonProteinCodingTranscripts.sort(compareTranscriptLengths);

  return [
    ...ensemblCanonicalTranscript,
    ...maneTranscripts,
    ...proteinCodingTranscripts,
    ...nonProteinCodingTranscripts
  ] as T;
}

// sorting an array of transcripts in-place
const sortProteinCodingTranscripts = (transcirpts: DefaultSortTranscript[]) => {
  transcirpts.sort((t1, t2) => {
    const t1Scores = getTranscriptScores(t1);
    const t2Scores = getTranscriptScores(t2);

    if (t1Scores.biotypeScore !== t2Scores.biotypeScore) {
      return t2Scores.biotypeScore - t1Scores.biotypeScore; // largest score first
    } else if (t1Scores.translationLength !== t2Scores.translationLength) {
      return t2Scores.translationLength - t1Scores.translationLength; // longest translations first
    } else {
      return t2Scores.transcriptLength - t1Scores.transcriptLength; // longest transcripts first
    }
  });
};

const getTranscriptScores = (transcript: DefaultSortTranscript) => {
  const {
    metadata: {
      biotype: { value: biotype }
    },
    slice: {
      location: { length: transcriptLength }
    }
  } = transcript;
  const translationLength =
    transcript.product_generating_contexts[0].product?.length ?? 0;
  return {
    biotypeScore: getBiotypeScore(biotype),
    transcriptLength,
    translationLength
  };
};

const getBiotypeScore = (biotype: string) => {
  if (biotype === 'protein_coding') {
    return 5;
  } else if (biotype === 'nonsense_mediated_decay') {
    return 4;
  } else if (biotype === 'non_stop_decay') {
    return 3;
  } else if (biotype.startsWith('IG_')) {
    return 2;
  } else if (biotype === 'polymorphic_pseudogene') {
    return 1;
  } else {
    return 0;
  }
};

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
  DefaultSortTranscript &
  GetSplicedRNALengthParam & {
    slice: SliceWithOnlyLength;
    spliced_exons: unknown[];
  } & Parameters<typeof isManeTranscript>[0] &
  Parameters<typeof isCanonical>[0];

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
