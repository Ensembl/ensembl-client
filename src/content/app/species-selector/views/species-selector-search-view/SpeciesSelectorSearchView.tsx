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

import ModalView from 'src/shared/components/modal-view/ModalView';
import FeatureSearchForm from 'src/shared/components/feature-search-form/FeatureSearchForm';

import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import { useAppSelector } from 'src/store';
import { getCommittedSpecies } from '../../state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import styles from './SpeciesSelectorSearchView.module.css';
import radioStyles from 'src/shared/components/radio-group/RadioGroup.module.css';
import {
  FeatureSearchMode,
  FEATURE_SEARCH_MODES as featureSearchModes,
  FeatureSearchModeType
} from 'src/shared/types/search-api/search-modes';
import { FeatureSearchResults } from 'src/shared/components/feature-search-result/FeatureSearchResult';

const SpeciesSelectorSearchView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialMode = location.pathname.includes('/variant')
    ? featureSearchModes.find(
        (m) => m.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE
      )!
    : featureSearchModes.find(
        (m) => m.mode === FeatureSearchModeType.GENE_SEARCH_MODE
      )!;

  const [activeSearchMode, setActiveSearchMode] =
    useState<FeatureSearchMode>(initialMode);
  const [queries, setQueries] = useState<Record<string, string>>({
    gene: '',
    variant: ''
  });

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const { currentData: currentVariantSearchResults } = variantSearchResults;

  const committedSpecies = useAppSelector(getCommittedSpecies);
  const genomeIds = committedSpecies.map(({ genome_id }) => genome_id);
  const query = queries[activeSearchMode.mode];
  const queryFromParams = searchParams.get('query') || '';

  useEffect(() => {
    // on mount, update the query from the URL (if any)
    if (queryFromParams) {
      setQueries((prev) => ({
        ...prev,
        [activeSearchMode.mode]: queryFromParams
      }));
    }
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    }

    if (activeSearchMode.mode === FeatureSearchModeType.GENE_SEARCH_MODE) {
      triggerGeneSearch({
        genome_ids: genomeIds,
        query: query,
        page: 1,
        per_page: 50
      });
    }

    if (activeSearchMode.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE) {
      triggerVariantSearch({
        genome_ids: genomeIds,
        query: query,
        page: 1,
        per_page: 50
      });
    }
  }, [query]);

  const onClose = () => {
    navigate(-1);
  };

  const onFeatureSearchSubmit = (input: string) => {
    setQueries((prev) => ({
      ...prev,
      [activeSearchMode.mode]: input
    }));

    if (input) {
      searchParams.set('query', input);
    } else {
      searchParams.delete('query');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const updateActiveFeatureSearchMode = (
    featureSearchMode: FeatureSearchMode
  ) => {
    setActiveSearchMode(featureSearchMode);

    const query = queries[featureSearchMode.mode];
    let path = `${urlFor.speciesSelector()}/search/${featureSearchMode.mode.toLowerCase()}`;
    if (query) {
      path += `?query=${encodeURIComponent(query)}`;
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
          updateActiveFeatureSearchMode={updateActiveFeatureSearchMode}
        />
        <SearchScope />
        {activeSearchMode.mode === FeatureSearchModeType.GENE_SEARCH_MODE && (
          <div className={styles.resultsWrapper}>
            <FeatureSearchResults
              featureSearchMode={activeSearchMode.mode}
              speciesList={committedSpecies}
              searchResults={currentGeneSearchResults}
            />
          </div>
        )}
        {activeSearchMode.mode ===
          FeatureSearchModeType.VARIANT_SEARCH_MODE && (
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
