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

import { parseEnsObjectId } from 'ensemblRoot/src/shared/state/ens-object/ensObjectHelpers';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { RootState } from 'src/store';
import { useEffect } from 'react';

const useEntityViewerAnalytics = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId) || '';
  const commitedSpecies = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const speciesNameForAnalytics = commitedSpecies
    ? getSpeciesAnalyticsName(commitedSpecies)
    : '';

  const activeEntityId = useSelector(getEntityViewerActiveEntityId);
  const featureType = activeEntityId
    ? parseEnsObjectId(activeEntityId).type
    : '';

  useEffect(() => {
    analyticsTracking.setSpeciesDimension(speciesNameForAnalytics);
    analyticsTracking.setFeatureDimension(featureType);
  }, []);

  const trackTabChange = (tabName: string) => {
    analyticsTracking.trackEvent({
      category: 'entity_viewer',
      label: tabName,
      action: 'change_tab'
    });
  };

  return {
    trackTabChange
  };
};
export default useEntityViewerAnalytics;
