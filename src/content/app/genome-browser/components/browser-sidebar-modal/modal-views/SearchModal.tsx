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

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { closeBrowserSidebarModal } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

const SearchModal = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const { trackSidebarSearch } = useGenomeBrowserAnalytics();
  const dispatch = useAppDispatch();

  const onSearchMatchNavigation = () => {
    dispatch(closeBrowserSidebarModal());
  };

  return activeGenomeId ? (
    <InAppSearch
      app="genomeBrowser"
      genomeId={activeGenomeId}
      genomeIdForUrl={genomeIdForUrl as string}
      mode="sidebar"
      onSearchSubmit={trackSidebarSearch}
      onMatchNavigation={onSearchMatchNavigation}
    />
  ) : null;
};

export default SearchModal;
