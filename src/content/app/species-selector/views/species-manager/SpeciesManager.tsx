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
import type { FormEvent } from 'react';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useFilteredGenomes from './useFilteredGenomes';

import ModalView from 'src/shared/components/modal-view/ModalView';

import SelectedGenomesTable from './selected-genomes-table/SelectedGenomesTable';
import SpeciesLozengeDisplaySelector from 'src/content/app/species-selector/components/species-lozenge-display-selector/SpeciesLozengeDisplaySelector';
import AddButton from 'src/shared/components/add-button/AddButton';
import ShadedInput from 'src/shared/components/input/ShadedInput';

import styles from './SpeciesManager.module.css';

const SpeciesManager = () => {
  const navigate = useNavigate();
  const { allSelectedGenomes, filteredGenomes, onFilterChange } =
    useFilteredGenomes();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.container}>
        <MainContentTop onFilterChange={onFilterChange} />
        <div className={styles.genomesTableContainer}>
          <SelectedGenomesTable
            allSelectedGenomes={allSelectedGenomes}
            filteredGenomes={filteredGenomes}
          />
        </div>
      </div>
    </ModalView>
  );
};

const MainContentTop = (props: {
  onFilterChange: (event: FormEvent<HTMLInputElement>) => void;
}) => {
  const navigate = useNavigate();

  const onAddSpeciesClick = () => {
    navigate(urlFor.speciesSelector());
  };

  return (
    <div className={styles.mainContentTop}>
      <SpeciesLozengeDisplaySelector />
      <div className={styles.mainContentTopRight}>
        <label className={styles.filterFieldWrapper}>
          <span className={styles.labelText}>Find in list</span>
          <ShadedInput onChange={props.onFilterChange} />
        </label>
        <AddButton
          onClick={onAddSpeciesClick}
          className={styles.addSpeciesButton}
        >
          Add a species
        </AddButton>
      </div>
    </div>
  );
};

export default SpeciesManager;
