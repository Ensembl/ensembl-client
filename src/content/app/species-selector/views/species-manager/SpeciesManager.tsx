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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppDispatch } from 'src/store';

import useFilteredGenomes from './useFilteredGenomes';

import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import ModalView from 'src/shared/components/modal-view/ModalView';

import SelectedGenomesTable from './selected-genomes-table/SelectedGenomesTable';
import SpeciesLozengeDisplaySelector from 'src/content/app/species-selector/components/species-lozenge-display-selector/SpeciesLozengeDisplaySelector';
import AddButton from 'src/shared/components/add-button/AddButton';
import { PrimaryButton } from 'src/shared/components/button/Button';
import ShadedInput from 'src/shared/components/input/ShadedInput';

import TrashcanIcon from 'static/icons/icon_delete.svg';

import styles from './SpeciesManager.module.css';

const SpeciesManager = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { allSelectedGenomes, filteredGenomes, onFilterChange } =
    useFilteredGenomes();
  const [selectedGenomeIds, setSelectedGenomeIds] = useState<string[]>([]);
  const availableGenomeIds = new Set(
    allSelectedGenomes.map((genome) => genome.genome_id)
  );
  const selectedAvailableGenomeIds = selectedGenomeIds.filter((genomeId) =>
    availableGenomeIds.has(genomeId)
  );

  const onClose = () => {
    navigate(-1);
  };

  const removeSelectedGenomes = () => {
    for (const genomeId of selectedAvailableGenomeIds) {
      dispatch(deleteSpeciesAndSave(genomeId));
    }
    setSelectedGenomeIds([]);
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.container}>
        <MainContentTop
          onFilterChange={onFilterChange}
          hasSelectedGenomes={!!selectedAvailableGenomeIds.length}
          onRemoveSelectedGenomes={removeSelectedGenomes}
        />
        <div className={styles.genomesTableContainerOuter}>
          <div className={styles.genomesTableContainerInner}>
            <SelectedGenomesTable
              allSelectedGenomes={allSelectedGenomes}
              filteredGenomes={filteredGenomes}
              selectedGenomeIds={selectedAvailableGenomeIds}
              onSelectedGenomeIdsChange={setSelectedGenomeIds}
            />
          </div>
        </div>
      </div>
    </ModalView>
  );
};

const MainContentTop = (props: {
  onFilterChange: (event: FormEvent<HTMLInputElement>) => void;
  hasSelectedGenomes: boolean;
  onRemoveSelectedGenomes: () => void;
}) => {
  const navigate = useNavigate();

  const onAddSpeciesClick = () => {
    navigate(urlFor.speciesSelector());
  };

  return (
    <div className={styles.mainContentTop}>
      <SpeciesLozengeDisplaySelector />
      <div className={styles.mainContentTopRight}>
        <div className={styles.tableActions}>
          <label className={styles.filterFieldWrapper}>
            <ShadedInput
              onChange={props.onFilterChange}
              placeholder="Find in list"
            />
          </label>
          <AddButton
            onClick={onAddSpeciesClick}
            className={styles.addSpeciesButton}
          >
            Add a species
          </AddButton>
        </div>
        <div className={styles.removeGenomesControls}>
          <div className={styles.removeGenomesControlsTop}>
            <div className={styles.removeGenomesAction}>
              <div className={styles.removeGenomesLabel}>
                <TrashcanIcon
                  className={classNames(styles.removeGenomesIcon, {
                    [styles.removeGenomesIconDisabled]:
                      !props.hasSelectedGenomes
                  })}
                />
              </div>
              <PrimaryButton
                type="button"
                className={styles.removeGenomesButton}
                disabled={!props.hasSelectedGenomes}
                onClick={props.onRemoveSelectedGenomes}
              >
                Remove genomes
              </PrimaryButton>
            </div>
            <div
              className={classNames(styles.removeGenomesWarning, {
                [styles.removeGenomesWarningHidden]: !props.hasSelectedGenomes
              })}
              aria-hidden={!props.hasSelectedGenomes}
            >
              Do you wish to delete the genomes from your list ?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesManager;
