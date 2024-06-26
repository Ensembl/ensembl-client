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

import type { SpeciesSearchResponse } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import styles from './SpeciesSearchResultsSummary.module.css';

type Props = {
  searchResults?: SpeciesSearchResponse;
};

const SpeciesSearchResultsSummary = (props: Props) => {
  const searchMatchesCount = props.searchResults?.meta.total_count ?? 0;

  return searchMatchesCount > 0 ? (
    <SuccessfulSearchResults count={searchMatchesCount} />
  ) : (
    <NoResults />
  );
};

const SuccessfulSearchResults = (props: { count: number }) => {
  const { count } = props;

  return (
    <div className={styles.container}>
      <span>
        <span className={styles.searchMatchesCount}>{count}</span> results
      </span>
    </div>
  );
};

const NoResults = () => {
  return (
    <div className={styles.container}>
      <div>
        <span>
          <span className={styles.searchMatchesCount}>0</span> results
        </span>
      </div>
      <div className={styles.noMatchesMessage}>
        Sorry, we don’t recognise, or may not have data for this species
      </div>
      <SearchHelp />
    </div>
  );
};

const SearchHelp = () => {
  return (
    <div className={styles.searchHelp}>
      <p>
        In order to help you find what you’re really looking for, could we
        suggest
      </p>
      <ul>
        <li>only search for a species</li>
        <li>use a full name where possible</li>
        <li>try a different name or identifier</li>
      </ul>
    </div>
  );
};

export default SpeciesSearchResultsSummary;
