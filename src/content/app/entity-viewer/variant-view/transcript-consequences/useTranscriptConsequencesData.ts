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
  useVariantTranscriptConsequencesQuery
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

type Params = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
};

const useTranscriptConsequencesData = (params: Params) => {
  const {
    currentData: defaultVariantData,
    isFetching: isVariantLoading,
    isError: isVariantError
  } = useDefaultEntityViewerVariantQuery({
    genomeId: params.genomeId,
    variantId: params.variantId
  });

  const {
    currentData: transcriptConsequencesData,
    isFetching: areTranscriptConsequencesLoading,
    isError: isTranscriptConsequencesError
  } = useVariantTranscriptConsequencesQuery(params);

  if (!defaultVariantData || !transcriptConsequencesData) {
    return {
      currentData: null,
      isLoading: isVariantLoading || areTranscriptConsequencesLoading,
      isError: isVariantError || isTranscriptConsequencesError
    };
  }

  const transcriptConsData = transcriptConsequencesData.variant.alleles.find(
    (allele) => allele.urlId === params.activeAlleleId
  );

  return {
    currentData: {
      variant: defaultVariantData.variant,
      transcriptAllele: transcriptConsData?.allele_sequence,
      transcriptConsequences:
        transcriptConsData?.predicted_molecular_consequences
    },
    isLoading: false,
    isError: false
  };
};

export default useTranscriptConsequencesData;
