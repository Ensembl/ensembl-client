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

import { getReferenceAndAltAlleles } from 'src/shared/helpers/variantHelpers';

import {
  useDefaultEntityViewerVariantQuery,
  useVariantStudyPopulationsQuery,
  useVariantAllelePopulationFrequenciesQuery
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import type { VariantStudyPopulationsQueryResult } from 'src/content/app/entity-viewer/state/api/queries/variantStudyPopulationsQuery';
import type { VariantAlleleInResponse as VariantAlleleInFrequenciesResponse } from 'src/content/app/entity-viewer/state/api/queries/variantAlleleFrequenciesQuery';
import type { VariantDetailsAllele } from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';

type Params = {
  genomeId: string;
  variantId: string;
  activeAlleleId: string;
};

export type PreparedPopulationFrequencyData =
  VariantStudyPopulationsQueryResult['populations'][number] & {
    allele_frequency: number;
  };

const usePopulationAlleleFrequenciesData = (params: Params) => {
  const { genomeId, activeAlleleId } = params;
  const {
    currentData: defaultVariantData,
    isFetching: isVariantLoading,
    isError: isVariantError
  } = useDefaultEntityViewerVariantQuery({
    genomeId: params.genomeId,
    variantId: params.variantId
  });
  const {
    currentData: studyPopulationsData,
    isFetching: arePopulationsLoading,
    isError: isPopulationsError
  } = useVariantStudyPopulationsQuery({ genomeId });
  const {
    currentData: alleleFrequenciesData,
    isFetching: areAlleleFrequenciesLoading,
    isError: isAlleleFrequenciesError
  } = useVariantAllelePopulationFrequenciesQuery(params);

  if (!defaultVariantData || !studyPopulationsData || !alleleFrequenciesData) {
    return {
      currentData: null,
      isLoading:
        isVariantLoading ||
        arePopulationsLoading ||
        areAlleleFrequenciesLoading,
      isError: isVariantError || isPopulationsError || isAlleleFrequenciesError
    };
  }

  const populationGroups = getPopulationGroups(
    studyPopulationsData.populations
  );

  const { referenceAllele } = getReferenceAndAltAlleles(
    defaultVariantData.variant.alleles
  );
  const currentAllele = defaultVariantData.variant.alleles.find(
    (allele) => allele.urlId === activeAlleleId
  ) as VariantDetailsAllele;

  const populationsMap = new Map<
    string,
    VariantStudyPopulationsQueryResult['populations'][number]
  >();

  for (const population of studyPopulationsData.populations) {
    populationsMap.set(population.name, population);
  }

  const referenceAlleleFreqData = alleleFrequenciesData.variant.alleles.find(
    (allele) => allele.urlId === referenceAllele?.urlId
  );

  const referenceAlleleData = prepareAlleleData({
    populationsMap,
    allele: referenceAllele as VariantDetailsAllele,
    alleleFrequenciesData:
      referenceAlleleFreqData as VariantAlleleInFrequenciesResponse
  });

  if (referenceAllele?.urlId === currentAllele.urlId) {
    return {
      currentData: {
        variant: defaultVariantData.variant,
        referenceAllele: referenceAlleleData,
        altAllele: null,
        populationGroups
      },
      isLoading: false,
      isError: false
    };
  } else {
    const altAllelFreqeData = alleleFrequenciesData.variant.alleles.find(
      (allele) => allele.urlId === activeAlleleId
    );

    const altAlleleData = prepareAlleleData({
      populationsMap,
      allele: currentAllele as VariantDetailsAllele,
      alleleFrequenciesData:
        altAllelFreqeData as VariantAlleleInFrequenciesResponse
    });

    return {
      currentData: {
        variant: defaultVariantData.variant,
        referenceAllele: referenceAlleleData,
        altAllele: altAlleleData,
        populationGroups
      },
      isLoading: false,
      isError: false
    };
  }
};

const prepareAlleleData = ({
  populationsMap,
  allele,
  alleleFrequenciesData
}: {
  populationsMap: Map<
    string,
    VariantStudyPopulationsQueryResult['populations'][number]
  >;
  alleleFrequenciesData: VariantAlleleInFrequenciesResponse;
  allele: VariantDetailsAllele;
}) => {
  const populationFrequencies = alleleFrequenciesData.population_frequencies
    .map((popFreq) => {
      const population = populationsMap.get(popFreq.population_name);
      if (!population) {
        return null;
      }
      return {
        ...population,
        allele_frequency: popFreq.allele_frequency
      };
    })
    .filter(Boolean) as PreparedPopulationFrequencyData[];
  populationFrequencies.sort((a, b) => a.name.localeCompare(b.name));

  const { globalFrequencies, regionalFrequencies } =
    separatePopulationFrequencies(populationFrequencies);

  return {
    alleleId: allele.urlId,
    sequence: allele.allele_sequence,
    globalAlleleFrequencies: globalFrequencies,
    populationFrequencies: regionalFrequencies
  };
};

/**
 * Separate global population frequencies from regional population frequencies
 * (there will be 1 or more global population allele frequency; one per study)
 */
const separatePopulationFrequencies = <
  T extends VariantStudyPopulationsQueryResult['populations'][number]
>(
  populationFrequencies: T[]
) => {
  const globalPopFreqIndices: number[] = [];

  for (let i = 0; i < populationFrequencies.length; i++) {
    const popFreq = populationFrequencies[i];
    if (popFreq.is_global) {
      globalPopFreqIndices.push(i);
    }
  }

  const globalFrequencies: T[] = [];

  for (const index of globalPopFreqIndices) {
    const popFreq = populationFrequencies[index];
    globalFrequencies.push(popFreq);
    populationFrequencies.splice(index, 1, null as any); // temporarily, put null in place of the removed array item
  }

  // collapse the initial array of population frequencies, removing from them the empty placeholders
  const regionalFrequencies = populationFrequencies.filter(
    (popFreq) => popFreq !== null
  );

  return {
    globalFrequencies,
    regionalFrequencies
  };
};

const getPopulationGroups = (
  populations: VariantStudyPopulationsQueryResult['populations']
) => {
  const populationGroups = new Set<string>();

  for (const population of populations) {
    if (!populationGroups.has(population.display_group_name)) {
      populationGroups.add(population.display_group_name);
    }
  }

  return [...populationGroups].toSorted(
    (a, b) => a.charCodeAt(0) - b.charCodeAt(0)
  );
};

export default usePopulationAlleleFrequenciesData;
