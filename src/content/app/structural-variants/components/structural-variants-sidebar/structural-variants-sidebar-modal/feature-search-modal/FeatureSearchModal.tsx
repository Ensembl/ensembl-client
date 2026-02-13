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

import {
  getReferenceGenome,
  getAlternativeGenome
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import { useLazySearchGenesQuery } from 'src/shared/state/api-slices/searchApiSlice';

import FeatureSearchForm from './FeatureSearchForm';
import SearchMatches from './SearchMatches';
import { CircleLoader } from 'src/shared/components/loader';

import type { GeneSearchMatch } from 'src/shared/types/search-api/search-match';

import sharedStyles from 'src/shared/components/in-app-search/InAppSearch.module.css';
import styles from './FeatureSearchModal.module.css';

/**
 * QUESTIONS:
 * - Can FeatureSearchForm component be reused here?
 * - Is there anything else reusable from InAppSearch?
 */

const FeatureSearchModal = () => {
  // const [ searchQuery, setSearchQuery ] = useState<string | null>(null);
  const [trigger, { isFetching, currentData, reset }] =
    useLazySearchGenesQuery();
  const referenceGenome = useAppSelector(getReferenceGenome);
  const altGenome = useAppSelector(getAlternativeGenome);

  const onSearchSubmit = (query: string) => {
    trigger({
      query,
      genome_ids: [referenceGenome!.genome_id],
      page: 1,
      per_page: 50
    });
    // setSearchQuery(query);
  };

  // const onClear = () => setSearchQuery(null);

  // const onSearchMatchNavigation = () => {
  //   dispatch(closeSidebarModal());
  // };

  return (
    <div className={styles.container}>
      <FeatureSearchForm onSearchSubmit={onSearchSubmit} onClear={reset} />
      <div className={sharedStyles.resultsContainerSidebar}>
        {isFetching && (
          <CircleLoader className={sharedStyles.spinner} size="small" />
        )}
        {currentData && (
          <SearchMatches
            referenceGenomeId={referenceGenome!.genome_id}
            altGenomeId={altGenome!.genome_id}
            matches={currentData.matches as GeneSearchMatch[]}
          />
        )}
      </div>
    </div>
  );
};

export default FeatureSearchModal;
