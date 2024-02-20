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
  useDefaultEntityViewerVariantQuery,
  useVariantPredictedMolecularConsequencesQuery,
  useGeneForVariantTranscriptConsequencesQuery
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

type Params = {
  genomeId: string;
  variantId: string;
  alleleId: string;
};

export type TranscriptConsequencesData = NonNullable<
  ReturnType<typeof useTranscriptConsequencesData>['currentData']
>;

const useTranscriptConsequencesData = (params: Params) => {
  const { genomeId, variantId, alleleId } = params;

  const {
    currentData: variantData,
    isFetching: isVariantLoading,
    isError: isVariantError
  } = useDefaultEntityViewerVariantQuery({
    genomeId,
    variantId
  });

  const variantAllele = variantData?.variant.alleles.find(
    (allele) => allele.urlId === alleleId
  );

  const {
    currentData: consequencesData,
    isFetching: areConsequencesLoading,
    isError: isConsequencesError
  } = useVariantPredictedMolecularConsequencesQuery({
    genomeId,
    variantId
  });

  // current data will contain gene stable id; but currently it doesn't
  const consequencesForAllele = consequencesData?.variant.alleles.find(
    (allele) => allele.urlId === alleleId
  )?.predicted_molecular_consequences;

  const transcriptId = consequencesForAllele?.[0]?.feature_stable_id;

  const {
    currentData: geneData,
    isFetching: isLoadingGeneData,
    isError: isGeneDataError
  } = useGeneForVariantTranscriptConsequencesQuery(
    {
      genomeId,
      transcriptId: transcriptId ?? ''
    },
    {
      skip: !transcriptId
    }
  );

  const summaryData =
    variantData && consequencesData && geneData
      ? {
          variant: variantData.variant,
          allele: variantAllele,
          geneData: geneData.transcript.gene,
          transcriptConsequences: consequencesForAllele
        }
      : null;

  const isLoading =
    isVariantLoading || areConsequencesLoading || isLoadingGeneData;
  const isError = isVariantError || isConsequencesError || isGeneDataError;

  return {
    currentData: summaryData,
    isLoading,
    isError
  };
};

export default useTranscriptConsequencesData;
