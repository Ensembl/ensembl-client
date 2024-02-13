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
  calculateSliceStart,
  calculateSliceEnd
} from 'src/content/app/entity-viewer/variant-view/variant-image/useVariantImageData';
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
  const { gene, variant, allele } = params;
  const variantStart = variant?.slice.location.start;
  const variantEnd = variant?.slice.location.end;
  const alleleType = allele?.allele_type.value;
  let alleleSequence = allele?.allele_sequence ?? '';
  let variantLength = variant?.slice.location.length ?? 0;
  const regionLength = gene?.slice.region.length;
  const regionChecksum = gene?.slice.region.sequence.checksum;
  const strand = gene?.slice.strand.code;

  const hasAnchorBase = ['insertion', 'deletion'].includes(alleleType ?? '');

  variantLength = hasAnchorBase
    ? Math.min(variantLength - 1, 0)
    : variantLength;

  const genomicSliceStart = variantStart
    ? calculateSliceStart({
        variantStart,
        variantLength
      })
    : 0;
  const genomicSliceEnd =
    variantEnd && regionLength
      ? calculateSliceEnd({
          variantEnd,
          variantLength,
          regionLength
        })
      : 0;

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

  const variantToGeneStartDistance =
    strand === 'forward'
      ? (variantStart ?? 0) - (gene?.slice.location.start ?? 0)
      : (gene?.slice.location.end ?? 0) - (variantEnd ?? 0);
  const variantToGeneEndDistance =
    strand === 'forward'
      ? (gene?.slice.location.end ?? 0) - (variantEnd ?? 0)
      : (variantStart ?? 0) - (gene?.slice.location.start ?? 0);

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
          variantToGeneStartDistance,
          variantToGeneEndDistance
        }
      }
    : {
        isLoading,
        isError
      };
};

export default useTranscriptDetails;
