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

import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

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

import {
  FEATURE_SEARCH_MODES as featureSearchModes,
  FeatureSearchModeType
} from 'src/shared/types/search-api/search-constants';
import type {
  FeatureSearchMode,
} from 'src/shared/types/search-api/search-modes';

import ModalView from 'src/shared/components/modal-view/ModalView';
import FeatureSearchForm from 'src/shared/components/feature-search-form/FeatureSearchForm';
import { FeatureSearchResults } from 'src/shared/components/feature-search-result/FeatureSearchResult';

import styles from './SpeciesSelectorSearchView.module.css';
import radioStyles from 'src/shared/components/radio-group/RadioGroup.module.css';

const SpeciesSelectorSearchView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const featureQueries = useAppSelector(getFeatureQueries);
  const committedSpecies = useAppSelector(getCommittedSpecies);

  const initialMode = location.pathname.includes('/variant')
    ? featureSearchModes.find(
        (m) => m.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE
      )!
    : featureSearchModes.find(
        (m) => m.mode === FeatureSearchModeType.GENE_SEARCH_MODE
      )!;

  const [activeSearchMode, setActiveSearchMode] =
    useState<FeatureSearchMode>(initialMode);

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const { currentData: currentVariantSearchResults } = variantSearchResults;

  const genomeIds = committedSpecies.map(({ genome_id }) => genome_id);

  const featureSearchModeToKey = {
    [FeatureSearchModeType.GENE_SEARCH_MODE]: 'gene' as const,
    [FeatureSearchModeType.VARIANT_SEARCH_MODE]: 'variant' as const
  };
  const query = featureQueries[featureSearchModeToKey[activeSearchMode.mode]];
  const queryFromParams = searchParams.get('query') || '';
  const isGeneSearchMode =
    activeSearchMode.mode === FeatureSearchModeType.GENE_SEARCH_MODE;
  const isVariantSearchMode =
    activeSearchMode.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE;

  useEffect(() => {
    // load from url only on first render or refresh
    if (queryFromParams) {
      if (isGeneSearchMode) {
        dispatch(setGeneQuery(queryFromParams));
      } else if (isVariantSearchMode) {
        dispatch(setVariantQuery(queryFromParams));
      }
    }
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

  const onSearchModeChange = (
    featureSearchMode: FeatureSearchMode
  ) => {
    setActiveSearchMode(featureSearchMode);

    const currentQuery =
      featureQueries[featureSearchModeToKey[featureSearchMode.mode]];
    let path = `${urlFor.speciesSelector()}/search/${featureSearchMode.mode.toLowerCase()}`;
    if (currentQuery) {
      path += `?query=${encodeURIComponent(currentQuery)}`;
    }
    navigate(urlFor.speciesSelectorFeatureSearch(path), { replace: true });
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.main}>
        <FeatureSearchForm
          activeFeatureSearchMode={activeSearchMode}
          query={query}
          onSearchSubmit={onFeatureSearchSubmit}
          onClear={() => onFeatureSearchSubmit('')}
          onSearchModeChange={onSearchModeChange}
        />
        <SearchScope />
        {isGeneSearchMode && (
          <div className={styles.resultsWrapper}>
            <FeatureSearchResults
              featureSearchMode={activeSearchMode.mode}
              speciesList={committedSpecies}
              searchResults={currentGeneSearchResults}
            />
          </div>
        )}
        {isVariantSearchMode && (
          <div className={styles.resultsWrapper}>
            <FeatureSearchResults
              featureSearchMode={activeSearchMode.mode}
              speciesList={committedSpecies}
              searchResults={currentVariantSearchResults}
            />
          </div>
        )}
      </div>
    </ModalView>
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
