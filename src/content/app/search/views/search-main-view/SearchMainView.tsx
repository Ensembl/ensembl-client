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

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import FeatureSearchField from 'src/content/app/search/components/feature-search-field/FeatureSearchField';
import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';

import styles from './SearchMainView.module.css';

const SearchMainView = () => {
  const navigate = useNavigate();
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const canSearchFeature = committedSpecies.length > 0;

  const onSpeciesSearchSubmit = (query: string) => {
    navigate(
      urlFor.speciesSelectorSearch({
        query
      })
    );
  };

  const onFeatureSearchSubmit = (query: string) => {
    navigate(
      urlFor.searchResults({
        query
      }),
      { state: { returnTo: urlFor.search() } }
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchPanel}>
        <div className={styles.searchFields}>
          <SpeciesSearchField
            labelStyle="with-icon"
            onSearchSubmit={onSpeciesSearchSubmit}
          />
          <FeatureSearchField
            onSearchSubmit={onFeatureSearchSubmit}
            canSubmit={canSearchFeature}
            disabled={!canSearchFeature}
            labelStyle="with-icon"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchMainView;
