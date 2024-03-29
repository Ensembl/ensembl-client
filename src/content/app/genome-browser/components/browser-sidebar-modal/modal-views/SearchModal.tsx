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

import React from 'react';
import { useSelector } from 'react-redux';

import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import InAppSearch from 'src/shared/components/in-app-search/InAppSearch';

const SearchModal = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const { genomeIdForUrl } = useGenomeBrowserIds();
  const { trackSidebarSearch } = useGenomeBrowserAnalytics();

  return (
    <section className="searchModal">
      <div>
        {activeGenomeId && (
          <InAppSearch
            app="genomeBrowser"
            genomeId={activeGenomeId}
            genomeIdForUrl={genomeIdForUrl as string}
            mode="sidebar"
            onSearchSubmit={trackSidebarSearch}
          />
        )}
      </div>
    </section>
  );
};

export default SearchModal;
