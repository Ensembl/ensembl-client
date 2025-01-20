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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { setActiveGenomeId } from 'src/content/app/regulatory-activity-viewer/state/general/generalSlice';

import useActivityViewerIds from './useActivityViewerIds';

/**
 * For starters, just make sure that if there is no active genome id already selected,
 * then the genome id of the first selected species is used.
 *
 * TODO:
 * - add actual routing
 */

const useActivityViewerRouting = () => {
  const { activeGenomeId } = useActivityViewerIds();
  const allSelectedSpecies = useAppSelector(getCommittedSpecies);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeGenomeId) {
      // A temporary solution; the logic is not correct
      const firstSelectedSpecies = allSelectedSpecies[0];

      if (firstSelectedSpecies) {
        const { genome_id } = firstSelectedSpecies;
        dispatch(setActiveGenomeId(genome_id));
      }
    }
  }, [activeGenomeId]);
};

export default useActivityViewerRouting;
