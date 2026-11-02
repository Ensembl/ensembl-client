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

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { latestRoutesMap } from 'src/content/app/sequence-viewer/utils/latestRoutes';

import useSequenceViewerIds from './useSequenceViewerIds';

const useSequenceViewerRouting = () => {
  const { genomeIdInUrl, genomeId, focusObjectIdInUrl } =
    useSequenceViewerIds();
  const allSelectedGenomes = useAppSelector(getEnabledCommittedSpecies);
  const urlLocation = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!genomeIdInUrl) {
      // check if the last visited genome id is stored in the routes map
      if (latestRoutesMap.latestGenomeId) {
        const savedUrl =
          latestRoutesMap.genomeUrls[latestRoutesMap.latestGenomeId];
        if (savedUrl) {
          navigate(savedUrl);
          return;
        }
      }

      // check if user has selected any genomes; pick the first if yes, and navigate to it
      const firstSelectedGenome = allSelectedGenomes[0];
      if (firstSelectedGenome) {
        const genomeIdForUrl =
          firstSelectedGenome.genome_tag ?? firstSelectedGenome.genome_id;
        const newUrl = urlFor.sequenceViewer({
          genomeId: genomeIdForUrl
        });
        navigate(newUrl);
      }
    }
  }, [genomeIdInUrl, allSelectedGenomes, navigate]);

  useEffect(() => {
    if (genomeId && !focusObjectIdInUrl) {
      const savedUrl = latestRoutesMap.genomeUrls[genomeId];
      if (savedUrl) {
        navigate(savedUrl);
        return;
      }

      // check if there is the latest url saved for
      // if there is a stored url for this genome, navigate to that url
      return;
    } else if (genomeId && focusObjectIdInUrl) {
      latestRoutesMap.latestGenomeId = genomeId;
      const urlToSave = urlLocation.pathname + urlLocation.search;
      latestRoutesMap.genomeUrls[genomeId] = urlToSave;
    }
  });
};

export default useSequenceViewerRouting;
