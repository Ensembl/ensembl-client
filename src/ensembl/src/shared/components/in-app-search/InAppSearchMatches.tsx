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

import React from 'react';

import type {
  SearchResults,
  SearchMatch
} from 'src/shared/state/in-app-search/inAppSearchSlice';
import type { InAppSearchMode } from './InAppSearch';

import styles from './InAppSearch.scss';

type InAppSearchMatchesProps = SearchResults & {
  mode: InAppSearchMode;
};

const InAppSearchMatches = (props: InAppSearchMatchesProps) => {
  return (
    <div className={styles.searchMatches}>
      {props.matches.map((match) => (
        <InAppSearchMatch
          key={match.stable_id}
          match={match}
          mode={props.mode}
        />
      ))}
    </div>
  );
};

type InAppSearchMatchProps = {
  match: SearchMatch;
  mode: InAppSearchMode;
};

const InAppSearchMatch = (props: InAppSearchMatchProps) => {
  const { symbol, stable_id } = props.match;

  const symbolElement = symbol ? <span>{symbol}</span> : null;
  const stableIdElement = <span>{stable_id}</span>;

  return (
    <div className={styles.searchMatch}>
      {symbolElement}
      {stableIdElement}
    </div>
  );
};

export default InAppSearchMatches;
