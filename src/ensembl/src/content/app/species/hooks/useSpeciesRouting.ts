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

import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { replace } from 'connected-react-router';
import { useSelector, useDispatch } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { setActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSlice';

const useSpeciesRouting = () => {
  const params: { [key: string]: string } = useParams();
  const dispatch = useDispatch();

  const { genomeId } = params;

  const activeGenomeId = useSelector(getActiveGenomeId);
  const committedSpecies = useSelector(getEnabledCommittedSpecies);

  useEffect(() => {
    if (!genomeId) {
      // handling navigation to /species
      // select either the species that the user viewed during the previous visit,
      // of the first selected species
      const selectedSpecies = committedSpecies.find(
        ({ genome_id }) => genome_id === activeGenomeId
      );
      const firstCommittedSpecies = committedSpecies[0];
      if (selectedSpecies) {
        changeGenomeId(selectedSpecies.genome_id);
      } else if (firstCommittedSpecies) {
        changeGenomeId(firstCommittedSpecies.genome_id);
      }
      return;
    }

    dispatch(setActiveGenomeId(genomeId));
  }, [genomeId]);

  const changeGenomeId = useCallback(
    (genomeId: string) => {
      const params = {
        genomeId
      };

      dispatch(replace(urlFor.speciesPage(params)));
    },
    [genomeId]
  );

  return {
    genomeId,
    changeGenomeId
  };
};

export default useSpeciesRouting;
