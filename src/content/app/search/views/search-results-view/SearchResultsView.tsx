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
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getCommittedSpecies,
  getHasLoadedStoredSpecies
} from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import ModalView from 'src/shared/components/modal-view/ModalView';
import FeatureSearchField from 'src/content/app/search/components/feature-search-field/FeatureSearchField';
import CombinedFeatureSearchResults from 'src/content/app/search/components/combined-feature-search-results/CombinedFeatureSearchResults';

import styles from './SearchResultsView.module.css';

const SearchResultsView = () => {
  const speciesList = useAppSelector(getCommittedSpecies);
  const hasLoadedStoredSpecies = useAppSelector(getHasLoadedStoredSpecies);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const hasNoSelectedSpecies = hasLoadedStoredSpecies && !speciesList.length;
  const returnTo = getReturnPath(location.state);
  const query = searchParams.get('query') ?? '';

  useEffect(() => {
    if (!query || hasNoSelectedSpecies) {
      navigate(urlFor.search(), { replace: true });
    }
  }, [navigate, query, hasNoSelectedSpecies]);

  if (!query || hasNoSelectedSpecies) {
    return null;
  }

  const onClose = () => {
    navigate(returnTo);
  };

  const onSearchSubmit = (input: string) => {
    navigate(
      urlFor.searchResults({
        query: input.trim()
      }),
      {
        replace: true,
        state: location.state
      }
    );
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.grid}>
        <FeatureSearchField onSearchSubmit={onSearchSubmit} onClose={onClose} />
        <CombinedFeatureSearchResults query={query} speciesList={speciesList} />
      </div>
    </ModalView>
  );
};

const getReturnPath = (state: unknown) => {
  if (
    typeof state === 'object' &&
    state !== null &&
    'returnTo' in state &&
    typeof state.returnTo === 'string'
  ) {
    return state.returnTo;
  }

  return urlFor.search();
};

export default SearchResultsView;
