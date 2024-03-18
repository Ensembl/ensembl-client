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

import {
  MAX_REFERENCE_ALLELE_DISPLAY_LENGTH,
  MIN_FLANKING_SEQUENCE_LENGTH
} from '../variant-image/variantImageConstants';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';

import { useRefgetSequenceQuery } from 'src/shared/state/api-slices/refgetSlice';
import { useTranscriptForVariantTranscriptConsequencesQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import type { TranscriptConsequencesData } from 'src/content/app/entity-viewer/variant-view/transcript-consequences/useTranscriptConsequencesData';
import type {
  VariantDetails,
  VariantDetailsAllele
} from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';
import type {
  GeneForVariantTranscriptConsequencesResponse,
  TranscriptForVariantTranscriptConsequencesResponse
} from 'src/content/app/entity-viewer/state/api/queries/variantTranscriptConsequencesQueries';

type Params = {
  genomeId: string;
  transcriptId: string;
  gene: TranscriptConsequencesData['geneData'][number];
  variant: TranscriptConsequencesData['variant'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
};

export type TranscriptDetailsData = NonNullable<
  ReturnType<typeof useTranscriptDetails>['currentData']
>;

const useTranscriptDetails = (params: Params) => {
  const { genomeId, transcriptId, gene, variant, allele } = params;

  const {
    currentData: transcriptData,
    isFetching: isLoadingTranscriptData,
    isError: isTranscriptDataError
  } = useTranscriptForVariantTranscriptConsequencesQuery(
    {
      genomeId,
      transcriptId: transcriptId ?? ''
    },
    {
      skip: !transcriptId
    }
  );

  const {
    currentData: genomicRegionData,
    isLoading: isGenomicRegionLoading,
    isError: isGenomicRegionError
  } = useGenomicRegionData({
    variant,
    allele,
    gene,
    transcript: transcriptData?.transcript
  });

  const summaryData =
    transcriptData && genomicRegionData
      ? {
          transcriptData: transcriptData.transcript,
          genomicRegionData
        }
      : null;

  const isLoading = isLoadingTranscriptData || isGenomicRegionLoading;
  const isError = isTranscriptDataError || isGenomicRegionError;

  return {
    currentData: summaryData,
    isLoading,
    isError
  };
};

/**
 * - get the sequence of the short genomic slice
 * - make sure to flip the slice sequence to reverse complement if the gene is on reverse strand
 * - this means that the variant allele sequence also has to be flipped to reverse complement
 * - remember that insertions and deletions are a special case (they have an anchor base)
 */
const useGenomicRegionData = (params: {
  variant?: VariantDetails;
  allele?: VariantDetailsAllele;
  gene?: GeneForVariantTranscriptConsequencesResponse['gene'];
  transcript?: TranscriptForVariantTranscriptConsequencesResponse['transcript'];
}) => {
  const { gene, transcript, variant, allele } = params;
  let variantStart = variant?.slice.location.start ?? 0;
  const alleleType = allele?.allele_type.value;
  let alleleSequence = allele?.allele_sequence ?? '';
  let variantLength = variant?.slice.location.length ?? 0;
  const regionChecksum = gene?.slice.region.sequence.checksum;
  const transcriptStart = transcript?.slice.location.start;
  const transcriptEnd = transcript?.slice.location.end;
  const strand = gene?.slice.strand.code;

  if (alleleType === 'deletion') {
    variantStart += 1;
    variantLength -= 1;
  } else if (alleleType === 'insertion') {
    if (strand === 'forward') {
      variantStart += 1;
    }
    variantLength = 0;
  }

  // distances to slice start and slice end are calculated for the forward strand
  const distanceToSliceStart = getDistanceToSliceStart({
    variantStart: variantStart,
    variantLength,
    transcriptStart: transcriptStart ?? 0,
    strand: strand ?? 'forward'
  });
  const distanceToSliceEnd = getDistanceToSliceEnd({
    variantStart: variantStart,
    variantLength,
    transcriptEnd: transcriptEnd ?? 0,
    strand: strand ?? 'forward'
  });
  const distanceToTranscriptStart = getDistanceToTranscriptStart({
    variantStart: variantStart,
    variantEnd: variantStart + variantLength ?? 0,
    transcriptStart: transcriptStart ?? 0,
    transcriptEnd: transcriptEnd ?? 0,
    strand: strand ?? 'forward'
  });
  const distanceToTranscriptEnd = getDistanceToTranscriptEnd({
    variantStart: variantStart,
    variantEnd: variantStart + variantLength ?? 0,
    transcriptStart: transcriptStart ?? 0,
    transcriptEnd: transcriptEnd ?? 0,
    strand: strand ?? 'forward'
  });

  const genomicSliceStart = (variantStart ?? 0) - distanceToSliceStart;
  const genomicSliceEnd =
    (variantStart ?? 0) + variantLength + distanceToSliceEnd - 1;

  const {
    currentData: referenceSequence,
    isLoading,
    isError
  } = useRefgetSequenceQuery(
    {
      checksum: regionChecksum ?? '',
      start: genomicSliceStart - 1, // translate to 0-based coordinate system that refget uses
      end: genomicSliceEnd
    },
    {
      skip: !variant || !gene || !transcript
    }
  );

  alleleSequence =
    strand === 'forward'
      ? alleleSequence
      : getReverseComplement(alleleSequence);

  if (alleleType === 'insertion') {
    // strip off the anchor base
    alleleSequence =
      strand === 'forward'
        ? alleleSequence.slice(1)
        : alleleSequence.slice(0, -1);
  }

  const leftFlankingSequence = getLeftFlankingGenomicSequence({
    sequence: referenceSequence ?? '',
    distanceToSliceStart,
    distanceToSliceEnd,
    strand: strand ?? 'forward'
  });
  const referenceAlleleSequence = getReferenceAlleleGenomicSequence({
    sequence: referenceSequence ?? '',
    distanceToSliceStart,
    distanceToSliceEnd,
    strand: strand ?? 'forward'
  });
  const rightFlankingSequence = getRightFlankingGenomicSequence({
    sequence: referenceSequence ?? '',
    distanceToSliceStart,
    distanceToSliceEnd,
    strand: strand ?? 'forward'
  });

  return referenceSequence
    ? {
        currentData: {
          leftFlankingSequence,
          rightFlankingSequence,
          referenceAlleleSequence,
          alleleSequence,
          variantToTranscriptStartDistance: distanceToTranscriptStart,
          variantToTranscriptEndDistance: distanceToTranscriptEnd
        }
      }
    : {
        isLoading,
        isError
      };
};

/**
 * Calculate the number of nucleotides to show to the left of the variant.
 * (Assume that the input variant start coordinate has been corrected for the possible presence of an anchor base).
 * The midpoint of the variant sequence will be displayed in the middle of the screen.
 */
export const getDistanceToSliceStart = (params: {
  variantStart: number;
  variantLength: number;
  transcriptStart: number;
  strand: 'forward' | 'reverse';
}) => {
  const { variantStart, variantLength, transcriptStart, strand } = params;
  const distanceToTranscriptStart = variantStart - transcriptStart;

  if (variantLength > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    return Math.min(MIN_FLANKING_SEQUENCE_LENGTH, distanceToTranscriptStart);
  }

  const halfMaxReferenceAlleleDisplayLength = Math.floor(
    MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2
  );

  // Even-length variants have their extra nucleotide to the left of the midpoint
  let halfVariantLength = Math.floor(variantLength / 2);

  if (strand === 'reverse' && variantLength && variantLength % 2 === 0) {
    halfVariantLength -= 1;
  }

  // how many more nucleotides can fit in the slot dedicated to reference allele
  const remainderForVariantSection =
    halfMaxReferenceAlleleDisplayLength - halfVariantLength;
  const maxDistanceToSliceStart =
    MIN_FLANKING_SEQUENCE_LENGTH + remainderForVariantSection;

  // in case the variant starts right near the start of the transcript
  return Math.min(maxDistanceToSliceStart, distanceToTranscriptStart);
};

/**
 * Calculates the number of nucleotides to show to the right of the variant
 * (i.e. distance from variant end to the end of the slice).
 * Similar to getDistanceToSliceStart; but for the transcript end
 */
export const getDistanceToSliceEnd = (params: {
  variantStart: number;
  variantLength: number;
  transcriptEnd: number;
  strand: 'forward' | 'reverse';
}) => {
  const { variantStart, variantLength, transcriptEnd, strand } = params;
  const distanceToTranscriptEnd =
    transcriptEnd - Math.max(variantStart + variantLength - 1, variantStart);

  if (variantLength > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    return Math.min(MIN_FLANKING_SEQUENCE_LENGTH, distanceToTranscriptEnd);
  }

  const halfMaxReferenceAlleleDisplayLength = Math.floor(
    MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2
  );

  // Even-length variants have their extra nucleotide to the left of the midpoint
  let halfVariantLength = Math.floor(variantLength / 2);

  if (strand === 'forward' && variantLength % 2 === 0) {
    halfVariantLength -= 1;
  } else if (strand === 'reverse' && !variantLength) {
    // insertion
    halfVariantLength -= 1;
  }

  // how many more nucleotides can fit in the slot dedicated to reference allele
  const remainderForVariantSection =
    halfMaxReferenceAlleleDisplayLength - halfVariantLength;
  const maxDistanceToSliceEnd =
    MIN_FLANKING_SEQUENCE_LENGTH + remainderForVariantSection;

  // in case the variant starts right near the end of the transcript
  return Math.min(maxDistanceToSliceEnd, distanceToTranscriptEnd);
};

export const getLeftFlankingGenomicSequence = ({
  sequence,
  distanceToSliceStart, // this is the distance to the beginning of the genomic slice on the forward strand
  distanceToSliceEnd, // this is the distance to the end of the genomic slice on the forward strand
  strand
}: {
  sequence: string;
  distanceToSliceStart: number;
  distanceToSliceEnd: number;
  strand: 'forward' | 'reverse';
}) => {
  if (strand === 'forward') {
    return sequence.slice(0, distanceToSliceStart);
  } else {
    return getReverseComplement(sequence).slice(0, distanceToSliceEnd);
  }
};

export const getRightFlankingGenomicSequence = ({
  sequence,
  distanceToSliceStart, // this is the distance to the beginning of the genomic slice on the forward strand
  distanceToSliceEnd, // this is the distance to the end of the genomic slice on the forward strand
  strand
}: {
  sequence: string;
  distanceToSliceStart: number;
  distanceToSliceEnd: number;
  strand: 'forward' | 'reverse';
}) => {
  if (strand === 'forward') {
    return sequence.slice(-1 * distanceToSliceEnd);
  } else {
    return getReverseComplement(sequence).slice(-1 * distanceToSliceStart);
  }
};

export const getReferenceAlleleGenomicSequence = ({
  sequence,
  distanceToSliceStart, // this is the distance to the beginning of the genomic slice on the forward strand
  distanceToSliceEnd, // this is the distance to the end of the genomic slice on the forward strand
  strand
}: {
  sequence: string;
  distanceToSliceStart: number;
  distanceToSliceEnd: number;
  strand: 'forward' | 'reverse';
}) => {
  if (strand === 'forward') {
    const startIndex = distanceToSliceStart;
    const endIndex = sequence.length - distanceToSliceEnd;
    return sequence.slice(startIndex, endIndex);
  } else {
    const startIndex = distanceToSliceEnd;
    const endIndex = sequence.length - distanceToSliceStart;
    return getReverseComplement(sequence).slice(startIndex, endIndex);
  }
};

const getDistanceToTranscriptStart = ({
  variantStart,
  variantEnd,
  transcriptStart,
  transcriptEnd,
  strand
}: {
  variantStart: number;
  variantEnd: number;
  transcriptStart: number; // start coordinate on forward strand
  transcriptEnd: number; // start coordinate on reverse strand
  strand: 'forward' | 'reverse';
}) => {
  if (strand === 'forward') {
    return variantStart - transcriptStart;
  } else {
    return transcriptEnd - variantEnd;
  }
};

const getDistanceToTranscriptEnd = ({
  variantStart,
  variantEnd,
  transcriptStart,
  transcriptEnd,
  strand
}: {
  variantStart: number;
  variantEnd: number;
  transcriptStart: number; // start coordinate on forward strand
  transcriptEnd: number; // start coordinate on reverse strand
  strand: 'forward' | 'reverse';
}) => {
  if (strand === 'forward') {
    return transcriptEnd - variantEnd;
  } else {
    return variantStart - transcriptStart;
  }
};

export default useTranscriptDetails;
