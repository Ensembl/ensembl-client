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

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type SerializedError } from '@reduxjs/toolkit';

import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  getErrorMessage,
  isNotFoundError
} from 'src/shared/helpers/fetchHelper';
import {
  getFeatureSearchModeByLocation,
  getFeatureSearchLabelsByMode,
  type FeatureSearchMode,
  getFeatureSearchModes
} from 'src/shared/helpers/featureSearchHelpers';

import { useAppDispatch, useAppSelector } from 'src/store';
import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import { getCommittedSpecies } from '../../state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import {
  setGeneQuery,
  setVariantQuery
} from '../../state/species-selector-feature-search-slice/speciesSelectorFeatureSearchSlice';
import { getFeatureQueries } from '../../state/species-selector-feature-search-slice/speciesSelectorFeatureSearchSelectors';

import ModalView from 'src/shared/components/modal-view/ModalView';
import FeatureSearchForm from 'src/shared/components/feature-search-form/FeatureSearchForm';
import { FeatureSearchResults } from 'src/shared/components/feature-search-results/FeatureSearchResults';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { CommittedItem } from '../../types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';

import styles from './SpeciesSelectorSearchView.module.css';
import radioStyles from 'src/shared/components/radio-group/RadioGroup.module.css';

const SpeciesSelectorSearchView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const featureQueries = useAppSelector(getFeatureQueries);
  const committedSpecies = useAppSelector(getCommittedSpecies);

  const initialMode = getFeatureSearchModeByLocation(location.pathname);
  const [activeSearchMode, setActiveSearchMode] = useState<string>(initialMode);

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const {
    currentData: currentVariantSearchResults,
    error: variantSearchError
  } = variantSearchResults;

  const searchModes = [...getFeatureSearchModes()];
  const genomeIds = committedSpecies.map(({ genome_id }) => genome_id);

  const query = featureQueries[activeSearchMode as FeatureSearchMode];
  const queryFromParams = searchParams.get('query') || '';
  const isGeneSearchMode = activeSearchMode === 'gene';
  const isVariantSearchMode = activeSearchMode === 'variant';

  useEffect(() => {
    // load from url only on first render or refresh
    if (queryFromParams) {
      if (isGeneSearchMode) {
        dispatch(setGeneQuery(queryFromParams));
      } else if (isVariantSearchMode) {
        dispatch(setVariantQuery(queryFromParams));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    }

    const searchParams = {
      genome_ids: genomeIds,
      query: query,
      page: 1,
      per_page: 50
    };

    if (isGeneSearchMode) {
      triggerGeneSearch(searchParams);
    }

    if (isVariantSearchMode) {
      triggerVariantSearch(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onClose = () => {
    navigate(-1);
  };

  const onFeatureSearchSubmit = (input: string) => {
    const isEmpty = input.trim() === '';

    if (isGeneSearchMode) {
      dispatch(setGeneQuery(input));
      if (isEmpty) {
        geneSearchResults.reset();
      }
    } else if (isVariantSearchMode) {
      dispatch(setVariantQuery(input));
      if (isEmpty) {
        variantSearchResults.reset();
      }
    }

    if (input) {
      searchParams.set('query', input);
    } else {
      searchParams.delete('query');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const onSearchModeChange = (searchMode: string) => {
    if (isFeatureSearchMode(searchMode)) {
      setActiveSearchMode(searchMode as FeatureSearchMode);
      const currentQuery = featureQueries[searchMode as FeatureSearchMode];
      navigate(
        urlFor.speciesSelectorFeatureSearch(
          searchMode as FeatureSearchMode,
          currentQuery
        ),
        { replace: true }
      );
    }
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.main}>
        <SearchTabs
          activeFeatureSearchMode={activeSearchMode}
          onSearchModeChange={onSearchModeChange}
          searchModes={searchModes}
        />
        {isFeatureSearchMode(activeSearchMode) && (
          <FeatureSearchForm
            activeFeatureSearchMode={activeSearchMode as FeatureSearchMode}
            query={query}
            onSearchSubmit={onFeatureSearchSubmit}
            onClear={() => onFeatureSearchSubmit('')}
          />
        )}
        <SearchScope />

        {isGeneSearchMode ? (
          <GeneFeatureSearchResults
            featureSearchMode={activeSearchMode}
            searchResults={currentGeneSearchResults}
            speciesList={committedSpecies}
          />
        ) : isVariantSearchMode ? (
          <VariantFeatureSearchResults
            variantSearchError={variantSearchError}
            currentVariantSearchResults={currentVariantSearchResults}
            activeSearchMode={activeSearchMode}
            committedSpecies={committedSpecies}
          />
        ) : null}
      </div>
    </ModalView>
  );
};

const isFeatureSearchMode = (mode: string) => {
  return getFeatureSearchModes().includes(mode as FeatureSearchMode);
};

const SearchTabs = (props: {
  activeFeatureSearchMode: string;
  onSearchModeChange: (mode: string) => void;
  searchModes: string[];
}) => {
  const { activeFeatureSearchMode, onSearchModeChange, searchModes } = props;

  return (
    <div className={styles.tab}>
      {searchModes.map((searchMode) => {
        if (isFeatureSearchMode(searchMode)) {
          const searchModeLabels = getFeatureSearchLabelsByMode(
            searchMode as FeatureSearchMode
          );
          return searchMode === activeFeatureSearchMode ? (
            <TextButton key={searchMode} className={styles.activeTab} disabled>
              {searchModeLabels.label}
            </TextButton>
          ) : (
            <TextButton
              key={searchMode}
              onClick={() =>
                onSearchModeChange(searchMode as FeatureSearchMode)
              }
            >
              {searchModeLabels.label}
            </TextButton>
          );
        }
      })}
    </div>
  );
};

const GeneFeatureSearchResults = (props: {
  featureSearchMode: FeatureSearchMode;
  searchResults: SearchResults | undefined;
  speciesList: CommittedItem[];
}) => {
  const { featureSearchMode, searchResults, speciesList } = props;

  return (
    <div className={styles.resultsWrapper}>
      <FeatureSearchResults
        featureSearchMode={featureSearchMode}
        speciesList={speciesList}
        searchResults={searchResults}
      />
    </div>
  );
};

const VariantFeatureSearchResults = (props: {
  variantSearchError: FetchBaseQueryError | SerializedError | undefined;
  currentVariantSearchResults: SearchResults | undefined;
  activeSearchMode: FeatureSearchMode;
  committedSpecies: CommittedItem[];
}) => {
  const {
    variantSearchError,
    currentVariantSearchResults,
    activeSearchMode,
    committedSpecies
  } = props;

  return (
    <div className={styles.resultsWrapper}>
      {isNotFoundError(variantSearchError) ? (
        <span className={styles.warning}>
          {getErrorMessage(variantSearchError)}
        </span>
      ) : currentVariantSearchResults ? (
        <FeatureSearchResults
          featureSearchMode={activeSearchMode}
          speciesList={committedSpecies}
          searchResults={currentVariantSearchResults}
        />
      ) : null}
    </div>
  );
};

// NOTE: so far, this element is decorative; user won't be able to change the scope anyway
const SearchScope = () => {
  // FIXME: when doing this for real, use the RadioGroup component
  // (note that RadioGroup doesn't have disabled radios)
  return (
    <div className={styles.pseudoRadioGroup}>
      <div className={radioStyles.radioGroupItem}>
        <span
          className={classNames(radioStyles.radio, radioStyles.radioChecked)}
        />
        <span className={radioStyles.label}>Only species in list</span>
      </div>
      <div
        className={classNames(
          radioStyles.radioGroupItem,
          styles.pseudoRadioDisabled
        )}
      >
        <span className={radioStyles.radio} />
        <span className={radioStyles.label}>All Ensembl</span>
      </div>
    </div>
  );
};

export default SpeciesSelectorSearchView;
