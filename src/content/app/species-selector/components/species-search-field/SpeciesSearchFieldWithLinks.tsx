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

import type { ReactNode } from 'react';

import SpeciesSearchField, { type Props } from './SpeciesSearchField';

import styles from './SpeciesSearchField.module.css';

const SpeciesSearchFieldWithLinks = (
  props: Omit<Props, 'query' | 'label'> & {
    title?: string;
    titleIcon?: ReactNode;
    isFeatureSearch?: boolean;
  }
) => {
  const {
    title = 'Find a species',
    titleIcon,
    isFeatureSearch = false,
    ...searchFieldProps
  } = props;

  return (
    <div className={styles.searchFieldWithTitle}>
      <div className={styles.searchFieldHeader}>
        <span
          className={[
            styles.searchFieldTitle,
            isFeatureSearch ? styles.featureSearchTitle : '',
            searchFieldProps.disabled ? styles.disabledSearchFieldTitle : ''
          ].join(' ')}
        >
          {titleIcon}
          {title}
        </span>
      </div>
      <SpeciesSearchField
        {...searchFieldProps}
        label={null}
        ariaLabel={title}
      />
    </div>
  );
};

export default SpeciesSearchFieldWithLinks;
