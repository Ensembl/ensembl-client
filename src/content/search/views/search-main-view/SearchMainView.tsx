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
import SpeciesSearchFieldWithLinks from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchFieldWithLinks';
import {
  FeatureSearchIcon,
  SpeciesSelectorIcon
} from 'src/shared/components/app-icon';

import styles from './SearchMainView.module.css';

const featureSearchHelpText = `
Search for a gene, transcript or variant using a stable identifier, symbol or rsID.
`;

const featureSearchPlaceholder = 'Gene, transcript or variant ID...';

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
      })
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchPanel}>
        <div className={styles.searchFields}>
          <SpeciesSearchFieldWithLinks
            titleIcon={<SpeciesSelectorIcon />}
            onSearchSubmit={onSpeciesSearchSubmit}
            showFeatureSearchLinks={false}
          />
          <SpeciesSearchFieldWithLinks
            title="Find a feature"
            titleIcon={<FeatureSearchIcon />}
            isFeatureSearch={true}
            onSearchSubmit={onFeatureSearchSubmit}
            showFeatureSearchLinks={false}
            help={featureSearchHelpText}
            placeholder={featureSearchPlaceholder}
            canSubmit={canSearchFeature}
            disabled={!canSearchFeature}
          />
        </div>
      </div>
      <div className={styles.tabPanel} />
    </div>
  );
};

export default SearchMainView;
