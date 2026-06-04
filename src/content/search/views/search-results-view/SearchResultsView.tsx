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
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';
import SpeciesSearchFieldWithLinks from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchFieldWithLinks';

import {
  getCommittedSpecies,
  getHasLoadedStoredSpecies
} from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { SearchIcon } from 'src/shared/components/app-icon';
import FeatureSearchResultsView from 'src/shared/components/feature-search-results-view/FeatureSearchResultsView';

const SearchResultsView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') ?? '';

  useEffect(() => {
    if (!query) {
      navigate(urlFor.search(), { replace: true });
    }
  }, [navigate, query]);

  if (!query) {
    return null;
  }

  return <Content query={query} />;
};

const ResultsSearchField = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryFromParams = searchParams.get('query') ?? '';
  const returnTo = getReturnPath(location.state);

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

  const onClose = () => {
    navigate(returnTo);
  };

  return (
    <SpeciesSearchFieldWithLinks
      key={queryFromParams}
      title="Find a feature"
      titleIcon={<SearchIcon />}
      isFeatureSearch={true}
      initialQuery={queryFromParams}
      help={featureSearchHelpText}
      placeholder={featureSearchPlaceholder}
      onSearchSubmit={onSearchSubmit}
      onClose={onClose}
    />
  );
};

const featureSearchHelpText = `
Search for a gene, transcript or variant using a stable identifier, symbol or rsID.
`;

const featureSearchPlaceholder = 'Gene, transcript or variant ID...';

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

const Content = (props: { query: string }) => {
  const { query } = props;
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const hasLoadedStoredSpecies = useAppSelector(getHasLoadedStoredSpecies);

  return (
    <FeatureSearchResultsView
      query={query}
      speciesList={committedSpecies}
      hasLoadedSpecies={hasLoadedStoredSpecies}
      missingSpeciesRedirectPath={urlFor.search()}
      searchField={<ResultsSearchField />}
    />
  );
};

export default SearchResultsView;
