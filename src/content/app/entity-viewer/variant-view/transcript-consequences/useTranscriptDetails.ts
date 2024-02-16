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

// import {
//   calculateSliceStart,
//   calculateSliceEnd
// } from 'src/content/app/entity-viewer/variant-view/variant-image/useVariantImageData';
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

/**
 * - Fetch predicted molecular consequences for variant
 * - Filter out predicted molecular consequences for allele
 * - Use transcript id to fetch the gene
 * - Use transcript checksum to fetch the sequence
 * - Using gene slice and transcript slice, create a transcript image
 * - Create image for transcript genomic sequence
 */

type Params = {
  genomeId: string;
  transcriptId: string;
  gene: TranscriptConsequencesData['geneData'];
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
 * - what are the consequences of having the anchor base?
 */
const useGenomicRegionData = (params: {
  variant?: VariantDetails;
  allele?: VariantDetailsAllele;
  gene?: GeneForVariantTranscriptConsequencesResponse['transcript']['gene'];
  transcript?: TranscriptForVariantTranscriptConsequencesResponse['transcript'];
}) => {
  const { gene, transcript, variant, allele } = params;
  const variantStart = variant?.slice.location.start;
  const alleleType = allele?.allele_type.value;
  let alleleSequence = allele?.allele_sequence ?? '';
  let variantLength = variant?.slice.location.length ?? 0;
  const regionChecksum = gene?.slice.region.sequence.checksum;
  const transcriptStart = transcript?.slice.location.start;
  const transcriptEnd = transcript?.slice.location.end;
  const strand = gene?.slice.strand.code;

  const hasAnchorBase = ['insertion', 'deletion'].includes(alleleType ?? '');

  variantLength = hasAnchorBase
    ? Math.max(variantLength - 1, 0)
    : variantLength;

  // distances to slice start and slice end are calculated for the forward strand
  const distanceToSliceStart = getDistanceToSliceStart({
    variantStart: variantStart ?? 0,
    variantLength,
    transcriptStart: transcriptStart ?? 0,
    strand: strand ?? 'forward'
  });
  const distanceToSliceEnd = getDistanceToSliceEnd({
    variantStart: variantStart ?? 0,
    variantLength,
    transcriptEnd: transcriptEnd ?? 0,
    strand: strand ?? 'forward'
  });

  const genomicSliceStart = (variantStart ?? 0) - distanceToSliceStart;
  const genomicSliceEnd =
    (variantStart ?? 0) + variantLength + distanceToSliceEnd - 1;

  // const genomicSliceStart = variantStart
  //   ? calculateSliceStart({
  //       variantStart,
  //       variantLength
  //     })
  //   : 0;
  // const genomicSliceEnd =
  //   variantEnd && regionLength
  //     ? calculateSliceEnd({
  //         variantEnd,
  //         variantLength,
  //         regionLength
  //       })
  //     : 0;

  // console.log({
  //   variantEnd,
  //   regionLength,
  //   variant,
  //   genomicSliceStart,
  //   genomicSliceEnd
  // });

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
      skip: !regionChecksum // meaning that this query can be sent only after gene query has returned
    }
  );

  // console.log({
  //   variantLength,
  //   distanceToSliceStart,
  //   distanceToSliceEnd,
  //   genomicSliceStart,
  //   genomicSliceEnd,
  //   referenceSequence
  // });

  const variantToTranscriptStartDistance =
    strand === 'forward' ? distanceToSliceStart : distanceToSliceEnd;
  const variantToTranscriptEndDistance =
    strand === 'forward' ? distanceToSliceEnd : distanceToSliceStart;

  alleleSequence =
    strand === 'forward'
      ? alleleSequence
      : getReverseComplement(alleleSequence);
  const genomicSequence =
    strand === 'forward'
      ? referenceSequence ?? ''
      : getReverseComplement(referenceSequence ?? '');

  return referenceSequence
    ? {
        currentData: {
          genomicSequence,
          alleleSequence,
          variantToTranscriptStartDistance,
          variantToTranscriptEndDistance
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
  const halfMaxReferenceAlleleDisplayLength = Math.floor(
    MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2
  );

  // Even-length variants have their extra nucleotide to the left of the midpoint
  let halfVariantLength = Math.floor(variantLength / 2);

  if (strand === 'reverse' && variantLength % 2 === 0) {
    halfVariantLength -= 1;
  }

  // how many more nucleotides can fit in the slot dedicated to reference allele
  const remainderForVariantSection =
    halfMaxReferenceAlleleDisplayLength - halfVariantLength;
  const maxDistanceToSliceStart =
    MIN_FLANKING_SEQUENCE_LENGTH + remainderForVariantSection;
  const distanceToTranscriptStart = variantStart - transcriptStart;

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
  const halfMaxReferenceAlleleDisplayLength = Math.floor(
    MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2
  );

  // Even-length variants have their extra nucleotide to the left of the midpoint
  let halfVariantLength = Math.floor(variantLength / 2);

  if (strand === 'forward' && variantLength % 2 === 0) {
    halfVariantLength -= 1;
  }

  // how many more nucleotides can fit in the slot dedicated to reference allele
  const remainderForVariantSection =
    halfMaxReferenceAlleleDisplayLength - halfVariantLength;
  const maxDistanceToSliceEnd =
    MIN_FLANKING_SEQUENCE_LENGTH + remainderForVariantSection;
  const distanceToTranscriptEnd =
    transcriptEnd - Math.max(variantStart + variantLength - 1, variantStart);

  // in case the variant starts right near the end of the transcript
  return Math.min(maxDistanceToSliceEnd, distanceToTranscriptEnd);
};

export default useTranscriptDetails;
