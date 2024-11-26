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

import { useAppDispatch, useAppSelector } from 'src/store';

import { useUrlParams } from 'src/shared/hooks/useUrlParams';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';

import { updateSpeciesSidebarModalForGenome } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

const SpeciesSidebarSearch = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const { genomeId: genomeIdForUrl } =
    useUrlParams<'genomeId'>('/species/:genomeId');
  const dispatch = useAppDispatch();

  const onSearchMatchNavigation = () => {
    if (!activeGenomeId) {
      return; // should not happen
    }

    dispatch(
      updateSpeciesSidebarModalForGenome({
        activeGenomeId,
        fragment: { sidebarModalView: null }
      })
    );
  };

  return activeGenomeId ? (
    <InAppSearch
      app="speciesHome"
      genomeId={activeGenomeId}
      genomeIdForUrl={genomeIdForUrl as string}
      mode="sidebar"
      onMatchNavigation={onSearchMatchNavigation}
    />
  ) : null;
};

export default SpeciesSidebarSearch;
