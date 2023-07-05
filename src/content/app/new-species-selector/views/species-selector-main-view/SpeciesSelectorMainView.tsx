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

import { useAppDispatch } from 'src/store';

import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import SpeciesSearchField from 'src/content/app/new-species-selector/components/species-search-field/SpeciesSearchField';

import styles from './SpeciesSelectorMainView.scss';

const SpeciesSelectorMainView = () => {
  const dispatch = useAppDispatch();

  const openSelectionModalView = () => {
    dispatch(setModalView('species-search'));
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchPanel}>
        <SpeciesSearchField />
      </div>
      <div>
        <label>Popular</label>
        <div>
          <button onClick={openSelectionModalView}>Open modal view</button>
        </div>
      </div>
    </div>
  );
};

export default SpeciesSelectorMainView;
