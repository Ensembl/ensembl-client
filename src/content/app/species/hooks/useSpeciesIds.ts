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

import { useAppSelector } from 'src/store';
import { useUrlParams } from 'src/shared/hooks/useUrlParams';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';

const useSpeciesIds = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const committedSpecies = useAppSelector((state) =>
    getCommittedSpeciesById(state, activeGenomeId ?? '')
  );

  const { genomeId: genomeIdInUrl } =
    useUrlParams<'genomeId'>('/species/:genomeId');

  const genomeIdForUrl =
    genomeIdInUrl ?? committedSpecies?.url_slug ?? committedSpecies?.genome_id;

  return {
    genomeIdForUrl
  };
};

export default useSpeciesIds;
