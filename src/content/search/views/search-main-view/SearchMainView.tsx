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

import * as urlFor from 'src/shared/helpers/urlHelper';

import SpeciesSearchFieldWithLinks from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchFieldWithLinks';

import styles from './SearchMainView.module.css';

const featureSearchHelpText = `
Search for a gene, transcript or variant using a stable identifier, symbol or rsID.
`;

const featureSearchPlaceholder = 'Gene, transcript or variant ID...';

const SearchMainView = () => {
  const navigate = useNavigate();

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
            title="Find a feature"
            onSearchSubmit={onFeatureSearchSubmit}
            showFeatureSearchLinks={false}
            help={featureSearchHelpText}
            placeholder={featureSearchPlaceholder}
          />
        </div>
      </div>
      <div className={styles.tabPanel} />
    </div>
  );
};

export default SearchMainView;
