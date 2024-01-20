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

import type { Pick2 } from 'ts-multipick';

import { DISPLAYED_REFERENCE_SEQUENCE_LENGTH } from './variantImageConstants';

import { useDefaultEntityViewerVariantQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import { useRegionChecksumQuery } from 'src/shared/state/region/regionApiSlice';
import { useRefgetSequenceQuery } from 'src/shared/state/api-slices/refgetSlice';

import type { VariantPredictionResult } from 'src/shared/types/variation-api/variantPredictionResult';
import type { EntityViewerVariantDefaultQueryResult } from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';

export type ReferenceSequenceForVariantData = {
  referenceSequence: string;
  variant: EntityViewerVariantDefaultQueryResult['variant'];
  variantAlleleType: string;
  hasAnchorBase: boolean;
  variantStart: number;
  variantEnd: number;
  variantLength: number;
  regionName: string;
  regionLength: number;
  regionSliceStart: number;
  regionSliceEnd: number;
};

/**
 * NOTE on the "anchor base".
 * For some variant types, such as insertions and deletions (and, by extension, indels),
 * the first nucleotide in the variant sequence reported by the api is treated as an "anchor base",
 * i.e. the same nucleotide as in the reference sequence.
 * Since the actual sequence alteration happens after the anchor base,
 * we want to treat this nucleotide as just part of the reference sequence,
 * and not highlight it on the image, as we highlight the nucleotides of the actual variant.
 */

const useVariantImageData = (params: {
  genomeId: string;
  variantId: string;
}): {
  currentData?: ReferenceSequenceForVariantData;
  isLoading: boolean;
  isError: boolean;
} => {
  const { genomeId } = params;
  const {
    currentData: variantData,
    isLoading: isVariantRegionDataLoading,
    isError: isVariantRegionDataError
  } = useVariantRegionInformation(params);
  const hasAnchorBase = variantData?.hasAnchorBase ?? false;
  const regionName = variantData?.regionName ?? '';
  let variantStart = variantData?.start ?? 0;
  if (hasAnchorBase) {
    // see note about the anchor base above
    variantStart += 1;
  }
  const variantEnd = variantData?.end ?? 0;
  const variantLength = variantData?.variantLength ?? 0;

  const {
    currentData: regionChecksumData,
    isLoading: isRegionChecksumDataLoading,
    isError: isRegionChecksumDataError
  } = useRegionChecksumData({ genomeId, regionName });

  const regionLength = regionChecksumData?.region.length ?? 0;
  const regionChecksum = regionChecksumData?.region.sequence.checksum;

  const sliceStart = regionChecksumData
    ? calculateSliceStart({
        variantStart,
        variantLength
      })
    : 0;
  const sliceEnd = regionChecksumData
    ? calculateSliceEnd({
        variantEnd,
        variantLength,
        regionLength
      })
    : 0;

  const {
    currentData: referenceSequence,
    isLoading,
    isError
  } = useRefgetSequenceQuery(
    {
      checksum: regionChecksum ?? '',
      start: sliceStart - 1, // translate to 0-based coordinate system that refget uses
      end: sliceEnd
    },
    {
      skip: !regionChecksum
    }
  );

  const variantAlleleType = variantData!.variantAlleleType;

  return {
    currentData: referenceSequence
      ? {
          variantAlleleType,
          variant: variantData!.variant,
          referenceSequence,
          hasAnchorBase,
          variantStart,
          variantEnd,
          variantLength,
          regionName,
          regionLength,
          regionSliceStart: sliceStart,
          regionSliceEnd: sliceEnd
        }
      : undefined,
    isLoading:
      isLoading || isRegionChecksumDataLoading || isVariantRegionDataLoading,
    isError: isError || isRegionChecksumDataError || isVariantRegionDataError
  };
};

const useVariantRegionInformation = (params: {
  genomeId: string;
  variantId: string;
}) => {
  const { currentData, isLoading, isError } =
    useDefaultEntityViewerVariantQuery(params);

  if (!currentData) {
    return {
      currentData: null,
      isLoading,
      isError
    };
  }
  const { variant } = currentData;
  const {
    slice: {
      region: { name: regionName },
      location: { start, end }
    },
    allele_type: { value: alleleType }
  } = variant;

  // there should always be data about most severe consequence;
  // but adding a bogus fallback string just in case, and to appease typescript
  const mostSevereVariantConsequence =
    getMostSevereVariantConsequence(currentData.variant) || 'unknown';

  // see note about the anchor base above
  const hasAnchorBase = ['insertion', 'deletion', 'indel'].includes(alleleType);
  let {
    slice: {
      location: { length: variantLength }
    }
  } = variant;
  if (hasAnchorBase) {
    // for insertions, api already reports variant length as 0; no need to go to negative numbers
    variantLength = Math.max(variantLength - 1, 0);
  }

  return {
    currentData: {
      variant,
      variantAlleleType: alleleType,
      mostSevereVariantConsequence,
      hasAnchorBase,
      regionName,
      start,
      end,
      variantLength
    },
    isLoading: false,
    isError: false
  };
};

const useRegionChecksumData = (params: {
  genomeId: string;
  regionName?: string;
}) => {
  const { genomeId, regionName = '' } = params;

  return useRegionChecksumQuery(
    { genomeId, regionName },
    { skip: !regionName }
  );
};

export const calculateSliceStart = (params: {
  variantStart: number;
  variantLength: number;
}) => {
  const { variantStart, variantLength } = params;
  const displaySequenceMidpoint = Math.ceil(
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH / 2
  );
  const minFlankingSequenceLength = 10;
  const maxDisplayedVariantLength =
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH - 2 * minFlankingSequenceLength;

  if (variantLength > maxDisplayedVariantLength) {
    return Math.max(variantStart - minFlankingSequenceLength, 1);
  } else {
    const distanceToStart =
      variantLength % 2
        ? displaySequenceMidpoint - Math.floor(variantLength / 2) - 1 // for odd numbers
        : displaySequenceMidpoint - Math.floor(variantLength / 2); // for even numbers

    return Math.max(variantStart - distanceToStart, 1);
  }
};

export const calculateSliceEnd = (params: {
  variantEnd: number;
  variantLength: number;
  regionLength: number;
}) => {
  const { variantEnd, variantLength, regionLength } = params;

  const minFlankingSequenceLength = 10; // NOTE: think of ellipses
  const maxDisplayedVariantLength =
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH - 2 * minFlankingSequenceLength;

  if (variantLength > maxDisplayedVariantLength) {
    return Math.min(variantEnd + minFlankingSequenceLength, regionLength);
  } else {
    const distanceToFlankingSequence =
      Math.floor(maxDisplayedVariantLength / 2) - Math.floor(variantLength / 2);
    return Math.min(
      variantEnd + distanceToFlankingSequence + minFlankingSequenceLength,
      regionLength
    );
  }
};

type MostSevereConsequenceParams = Pick<VariantPredictionResult, 'result'> &
  Pick2<VariantPredictionResult, 'analysis_method', 'tool'>;

// FIXME: copied this from a genome browser file; should extract into a common file
const getMostSevereVariantConsequence = ({
  prediction_results: predictionResults
}: {
  prediction_results: MostSevereConsequenceParams[];
}) => {
  const consequencePrediction = predictionResults.find(
    ({ analysis_method }) => analysis_method.tool === 'Ensembl VEP'
  );

  return consequencePrediction?.result;
};

export default useVariantImageData;
