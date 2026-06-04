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
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';
import SpeciesSearchFieldWithLinks from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchFieldWithLinks';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { FeatureSearchIcon } from 'src/shared/components/app-icon';
import FeatureSearchResultsView from 'src/shared/components/feature-search-results-view/FeatureSearchResultsView';

const SpeciesSelectorSearchResultsView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') ?? '';

  useEffect(() => {
    if (!query) {
      navigate(urlFor.speciesSelector(), { replace: true });
    }
  }, [navigate, query]);

  if (!query) {
    return null;
  }

  return <Content query={query} />;
};

const ResultsSearchField = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get('query') ?? '';

  const onSearchSubmit = (input: string) => {
    setSearchParams(
      {
        query: input.trim()
      },
      { replace: true }
    );
  };

  const onClose = () => {
    navigate(urlFor.speciesSelector());
  };

  return (
    <SpeciesSearchFieldWithLinks
      key={queryFromParams}
      title="Find a feature"
      titleIcon={<FeatureSearchIcon />}
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

const Content = (props: { query: string }) => {
  const { query } = props;
  const committedSpecies = useAppSelector(getCommittedSpecies);

  return (
    <FeatureSearchResultsView
      query={query}
      speciesList={committedSpecies}
      missingSpeciesRedirectPath={urlFor.speciesSelector()}
      searchField={<ResultsSearchField />}
    />
  );
};

export default SpeciesSelectorSearchResultsView;
