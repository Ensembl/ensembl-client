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
import type { PredictedMolecularConsequenceInResponse } from 'src/content/app/entity-viewer/state/api/queries/variantPredictedMolecularConsequencesQuery';

type Params = {
  genomeId: string;
  transcriptId: string;
  gene: TranscriptConsequencesData['geneData'][number];
  variant: TranscriptConsequencesData['variant'];
  allele: NonNullable<TranscriptConsequencesData['allele']>;
  transcriptConsequences: PredictedMolecularConsequenceInResponse;
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

  const {
    currentData: proteinData,
    isLoading: isProteinDataLoading,
    isError: isProteinDataError
  } = useProteinData({
    isTranscriptLoading: isLoadingTranscriptData,
    transcriptConsequences: params.transcriptConsequences,
    transcript: transcriptData?.transcript
  });

  const summaryData =
    transcriptData && genomicRegionData
      ? {
          transcriptData: transcriptData.transcript,
          genomicRegionData,
          proteinData: proteinData
        }
      : null;

  const isLoading =
    isLoadingTranscriptData || isGenomicRegionLoading || isProteinDataLoading;
  const isError =
    isTranscriptDataError || isGenomicRegionError || isProteinDataError;

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

  if (alleleType === 'deletion' || alleleType === 'indel') {
    variantStart += 1;
    variantLength -= 1;
  } else if (alleleType === 'insertion') {
    if (strand === 'forward') {
      variantStart += 1;
    }
    variantLength = 0;
  }

  // the reason we are calculating variant end instead of just reading it from the api response
  // is because the api gives conflicting data for insertions (where end = start + 1, but length = 0)
  const variantEnd = variantLength
    ? variantStart + variantLength - 1
    : variantStart;

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
    variantStart,
    variantEnd,
    transcriptStart: transcriptStart ?? 0,
    transcriptEnd: transcriptEnd ?? 0,
    strand: strand ?? 'forward'
  });
  const distanceToTranscriptEnd = getDistanceToTranscriptEnd({
    variantStart,
    variantEnd,
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
      start: genomicSliceStart,
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

  if (alleleType === 'insertion' || alleleType === 'indel') {
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

const useProteinData = (params: {
  transcript?: TranscriptForVariantTranscriptConsequencesResponse['transcript'];
  transcriptConsequences: Params['transcriptConsequences'];
  isTranscriptLoading: boolean;
}) => {
  const { transcript, isTranscriptLoading, transcriptConsequences } = params;
  const { protein_location } = transcriptConsequences;

  const productInTranscript =
    transcript?.product_generating_contexts[0].product;
  const proteinChecksum = productInTranscript?.sequence.checksum;
  const proteinLength = productInTranscript?.length;
  const proteinId = productInTranscript?.stable_id; // currently, variation api does not include protein id in its consequences payload

  let { start: variantStart, end: variantEnd } = protein_location ?? {};

  if (variantStart && !variantEnd) {
    variantEnd = variantStart;
  } else if (variantEnd && !variantStart) {
    variantStart = variantEnd;
  }

  const proteinSliceCoordinates = getProteinSliceCoordinates({
    variantStart: variantStart ?? 1,
    variantEnd: variantEnd ?? 1,
    proteinLength: proteinLength ?? 1
  });

  const {
    currentData: proteinSequence,
    isLoading,
    isError
  } = useRefgetSequenceQuery(
    {
      checksum: proteinChecksum ?? '',
      start: proteinSliceCoordinates.proteinSliceStart,
      end: proteinSliceCoordinates.proteinSliceEnd
    },
    {
      skip: !proteinChecksum
    }
  );

  if (!transcript && isTranscriptLoading) {
    return {
      currentData: null,
      isLoading: true
    };
  } else if (!transcript) {
    // something wrong must have happened during the fetching of the transcript
    return {
      currentData: null,
      isError: true
    };
  } else if (!protein_location || !proteinId) {
    // no data about the protein (the transcript is probably non-coding)
    return {
      currentData: null
    };
  } else if (isLoading || isError) {
    return {
      currentData: null,
      isLoading,
      isError
    };
  }

  const currentData = {
    ...proteinSliceCoordinates,
    proteinStableId: proteinId,
    proteinLength: proteinLength as number, // at this point, there is a protein,
    proteinSequence: proteinSequence as string, // at this point, protein sequence will be a string
    variantStart: (variantStart || variantEnd) as number, // if start is not known, make it the same as the end
    variantEnd: (variantEnd || variantStart) as number, // if end is not known, make it the same as the start
    variantRefSequence: protein_location.ref_sequence,
    variantAltSequence: protein_location.alt_sequence
  };

  return {
    currentData
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
    return distanceToSliceStart ? sequence.slice(0, distanceToSliceStart) : '';
  } else {
    return distanceToSliceEnd
      ? getReverseComplement(sequence).slice(0, distanceToSliceEnd)
      : '';
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
    return distanceToSliceEnd ? sequence.slice(-1 * distanceToSliceEnd) : '';
  } else {
    return distanceToSliceStart
      ? getReverseComplement(sequence).slice(-1 * distanceToSliceStart)
      : '';
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

export const getProteinSliceCoordinates = ({
  variantStart,
  variantEnd,
  proteinLength
}: {
  variantStart: number;
  variantEnd: number;
  proteinLength: number;
}) => {
  const variantLength = variantEnd - variantStart + 1;

  let distanceToProteinSliceStart: number;
  let distanceToProteinSliceEnd: number;
  let proteinSliceStart: number;
  let proteinSliceEnd: number;

  if (variantLength > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    distanceToProteinSliceStart = Math.min(
      MIN_FLANKING_SEQUENCE_LENGTH,
      variantStart - 1
    );
    proteinSliceStart = variantStart - distanceToProteinSliceStart;

    distanceToProteinSliceEnd = Math.min(
      MIN_FLANKING_SEQUENCE_LENGTH,
      proteinLength - variantEnd
    );
    proteinSliceEnd = variantEnd + distanceToProteinSliceEnd;
  } else {
    const isVariantLengthEven = variantLength % 2 === 0;
    const variantLeftHalfLength = isVariantLengthEven
      ? variantLength / 2
      : Math.floor(variantLength / 2);
    const variantRightHalfLength = isVariantLengthEven
      ? variantLength / 2 - 1
      : Math.floor(variantLength / 2);
    const halfMaxReferenceAlleleDisplayLength = Math.floor(
      MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2
    );

    distanceToProteinSliceStart = Math.min(
      halfMaxReferenceAlleleDisplayLength -
        variantLeftHalfLength +
        MIN_FLANKING_SEQUENCE_LENGTH,
      variantStart - 1
    );
    distanceToProteinSliceEnd = Math.min(
      halfMaxReferenceAlleleDisplayLength -
        variantRightHalfLength +
        MIN_FLANKING_SEQUENCE_LENGTH,
      proteinLength - variantEnd
    );

    proteinSliceStart = variantStart - distanceToProteinSliceStart;
    proteinSliceEnd = variantEnd + distanceToProteinSliceEnd;
  }

  return {
    proteinSliceStart,
    proteinSliceEnd,
    distanceToProteinSliceStart,
    distanceToProteinSliceEnd
  };
};

export default useTranscriptDetails;
