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
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { AnalyticsOptions } from 'src/analyticsHelper';

const useSpeciesAnalytics = () => {
  const trackEvent = (ga: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      ...ga,
      app: AppName.SPECIES_PAGE
    });
  };

  const trackDeletedSpecies = (species: CommittedItem) => {
    const speciesNameForAnalytics = getSpeciesAnalyticsName(species);

    trackEvent({
      category: 'species_management',
      action: 'remove',
      species: speciesNameForAnalytics
    });
  };

  const trackSpeciesUse = (species: CommittedItem) => {
    const updatedStatus = species.isEnabled ? 'do_not_use' : 'use';

    const speciesNameForAnalytics = getSpeciesAnalyticsName(species);

    trackEvent({
      category: 'species_management',
      label: speciesNameForAnalytics,
      action: updatedStatus,
      species: speciesNameForAnalytics
    });
  };

  const trackSpeciesStatsSectionOpen = (
    species: CommittedItem,
    sectionName: string
  ) => {
    trackEvent({
      category: 'stats_section',
      action: 'open',
      label: sectionName,
      species: getSpeciesAnalyticsName(species)
    });
  };

  const trackSpeciesPageExampleLink = (
    species: CommittedItem,
    exampleLinkType: string
  ) => {
    trackEvent({
      category: 'species_data',
      action: 'example_link_clicked',
      label: exampleLinkType,
      species: getSpeciesAnalyticsName(species)
    });
  };

  const trackSidebarModelOpen = (iconName: string) => {
    trackEvent({
      category: 'sidebar_toolstrip',
      action: 'modal_opened',
      label: iconName
    });
  };

  return {
    trackDeletedSpecies,
    trackSpeciesUse,
    trackSpeciesStatsSectionOpen,
    trackSpeciesPageExampleLink,
    trackSidebarModelOpen
  };
};
export default useSpeciesAnalytics;
