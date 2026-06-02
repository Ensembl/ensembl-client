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

import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  getFeatureSearchLabelsByMode,
  getFeatureSearchModes
} from 'src/shared/helpers/featureSearchHelpers';

import SpeciesSearchField, { type Props } from './SpeciesSearchField';

import styles from './SpeciesSearchField.module.css';

const SpeciesSearchFieldWithLinks = (
  props: Omit<Props, 'query' | 'label'> & {
    title?: string;
    showFeatureSearchLinks?: boolean;
  }
) => {
  const {
    title = 'Find a species',
    showFeatureSearchLinks = true,
    ...searchFieldProps
  } = props;

  return (
    <div className={styles.searchFieldWithLinks}>
      <div className={styles.searchLinks}>
        <span>{title}</span>
        {showFeatureSearchLinks &&
          getFeatureSearchModes().map((mode) => {
            const { label } = getFeatureSearchLabelsByMode(mode);

            return (
              <Link
                key={mode}
                className={styles.featureSearchLink}
                to={urlFor.speciesSelectorFeatureSearch(mode)}
              >
                {label}
              </Link>
            );
          })}
      </div>
      <SpeciesSearchField {...searchFieldProps} label={null} />
    </div>
  );
};

export default SpeciesSearchFieldWithLinks;
