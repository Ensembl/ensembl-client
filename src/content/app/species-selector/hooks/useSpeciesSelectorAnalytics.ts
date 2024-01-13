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

import analyticsTracking from 'src/services/analytics-service';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';

import { AppName } from 'src/global/globalConfig';
import type { PopularSpecies } from 'src/content/app/species-selector/types/popularSpecies';
import type { AnalyticsOptions } from 'src/analyticsHelper';

const useSpeciesSelectorAnalytics = () => {
  const trackEvent = (params: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      ...params,
      app: AppName.SPECIES_SELECTOR
    });
  };

  /*  Species Selector Page Events */
  const trackSpeciesSearchQuery = (query: string) => {
    trackEvent({
      category: 'species_selector',
      action: 'search',
      value: query
    });
  };

  const trackPopularSpeciesClick = (species: PopularSpecies) => {
    const speciesNameForAnalytics = `${species.name} - ${species.species_taxonomy_id}`;

    trackEvent({
      category: 'popular_species',
      action: 'preselect',
      label: speciesNameForAnalytics
    });
  };

  const trackTotalSelectedGenomesCount = (genomesCount: number) => {
    // NOTE: genomesCount includes both already committed genomes and the newly added genomes

    trackEvent({
      category: 'species_selector',
      action: 'total_species_count',
      value: genomesCount
    });
  };

  const trackAddedGenome = (
    genome: Parameters<typeof getSpeciesAnalyticsName>[0]
  ) => {
    const nameFprAnalytics = getSpeciesAnalyticsName(genome);

    trackEvent({
      category: 'species_selector',
      action: 'add',
      value: nameFprAnalytics
    });
  };

  return {
    trackSpeciesSearchQuery,
    trackAddedGenome,
    trackPopularSpeciesClick,
    trackTotalSelectedGenomesCount
  };
};
export default useSpeciesSelectorAnalytics;
