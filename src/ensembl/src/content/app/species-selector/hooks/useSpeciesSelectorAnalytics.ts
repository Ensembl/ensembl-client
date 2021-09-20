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
import { useSelector } from 'react-redux';

import analyticsTracking from 'src/services/analytics-service';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import {
  PopularSpecies,
  SearchMatch
} from 'src/content/app/species-selector/types/species-search';
import { CurrentItem } from 'src/content/app/species-selector/state/speciesSelectorState';

const useSpeciesSelectorAnalytics = () => {
  const committedSpecies = useSelector(getCommittedSpecies);

  /*  Species Selector Page Events */
  const trackAutocompleteSpeciesSelect = (species: SearchMatch) => {
    const speciesNameForAnalytics = getSpeciesAnalyticsName(species);

    analyticsTracking.trackEvent({
      category: 'species_search',
      action: 'preselect',
      label: speciesNameForAnalytics,
      species: speciesNameForAnalytics
    });
  };

  const trackPopularSpeciesSelect = (
    species: PopularSpecies,
    action: string
  ) => {
    const speciesNameForAnalytics = getSpeciesAnalyticsName(species);

    analyticsTracking.trackEvent({
      category: 'popular_species',
      action: action,
      label: speciesNameForAnalytics,
      species: speciesNameForAnalytics
    });
  };

  const trackCommittedSpecies = (species: CurrentItem) => {
    const speciesNameForAnalytics = getSpeciesAnalyticsName(species);

    analyticsTracking.trackEvent({
      category: 'species_selector',
      label: speciesNameForAnalytics,
      action: 'add',
      species: speciesNameForAnalytics
    });

    if (committedSpecies.length > 1) {
      trackFinalSetOfSpecies(species);
    }
  };

  const trackFinalSetOfSpecies = (newlyCommittedSpecies: CurrentItem) => {
    const committedSpeciesNames = [newlyCommittedSpecies, ...committedSpecies]
      .map((species) => getSpeciesAnalyticsName(species))
      .sort();

    analyticsTracking.trackEvent({
      category: 'species_selector',
      action: 'select_multiple',
      label: committedSpeciesNames.join(','),
      value: committedSpeciesNames.length,
      species: ''
    });
  };

  return {
    trackCommittedSpecies,
    trackPopularSpeciesSelect,
    trackAutocompleteSpeciesSelect
  };
};
export default useSpeciesSelectorAnalytics;
