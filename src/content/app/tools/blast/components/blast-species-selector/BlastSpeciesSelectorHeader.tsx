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
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { clearSelectedSpecies } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesList } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import styles from './BlastSpeciesSelector.scss';

export type Props = {
  compact: boolean;
};

const BlastSpeciesSelectorHeader = (props: Props) => {
  const { compact } = props;
  const dispatch = useDispatch();

  const selectedSpeciesList = useSelector(getSelectedSpeciesList);

  const onClearAll = () => {
    dispatch(clearSelectedSpecies());
  };

  const headerClass = classNames(styles.header, {
    [styles.smallScreenHeader]: compact
  });

  return (
    <div className={headerClass}>
      <div className={styles.headerGroup}>
        <span className={styles.headerTitle}>Blast against</span>
        <span className={styles.speciesCounter}>
          {selectedSpeciesList.length}
        </span>
        <span className={styles.maxSpecies}>of 7 species</span>
        <span className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </span>
      </div>
    </div>
  );
};

export default BlastSpeciesSelectorHeader;
