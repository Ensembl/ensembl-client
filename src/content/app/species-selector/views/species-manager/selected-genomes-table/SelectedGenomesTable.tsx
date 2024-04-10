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

import React, { Fragment, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';
import { toggleSpeciesUseAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import { Table, ColumnHead } from 'src/shared/components/table';

import DeleteButton from 'src/shared/components/delete-button/DeleteButton';

import { PrimaryButton } from 'src/shared/components/button/Button';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import {
  CommonName,
  ScientificName,
  AssemblyName,
  AssemblyAccessionId,
  SpeciesType
} from 'src/shared/components/species-name-parts-for-table';

import HomeIcon from 'static/icons/icon_home.svg';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SelectedGenomesTable.module.css';

/**
 * TODO:
 * - Respond to screen width (show more / show less)
 * - When the last species is deleted, navigate (where? just one step back?)
 *
 * Qs:
 * - What to do if there are no selected species?
 *   Example: delete species, get transported to the species selector home page,
 *   then go back one page in browser history?
 */

type DeletionModeSettings = {
  rowDeletionInitiated: string;
  genomeIds: string[];
};

type TableState = {
  isShowingAllColumns: boolean;
  deletionModeSettings: DeletionModeSettings | null;
};

type EnterDeletionModeAction = {
  type: 'enter-deletion-mode';
  genomeId: string;
};

type ExitDeletionModeAction = {
  type: 'exit-deletion-mode';
};

type UpdateDeletionListAction = {
  type: 'update-deletion-list';
  genomeIds: string[];
};

type DispatchedTableAction =
  | EnterDeletionModeAction
  | ExitDeletionModeAction
  | UpdateDeletionListAction;

// The function accepts id of the genome in the table row where the delete button was clicked
const getNewDeleteModeSettings = (genomeId: string): DeletionModeSettings => {
  return {
    rowDeletionInitiated: genomeId,
    genomeIds: [genomeId]
  };
};

const initialState: TableState = {
  isShowingAllColumns: true,
  deletionModeSettings: null
};

const reducer = (
  state: TableState,
  action: DispatchedTableAction
): TableState => {
  switch (action.type) {
    case 'enter-deletion-mode':
      return {
        ...state,
        deletionModeSettings: getNewDeleteModeSettings(action.genomeId)
      };
    case 'exit-deletion-mode':
      return {
        ...state,
        deletionModeSettings: null
      };
    case 'update-deletion-list':
      return {
        ...state,
        deletionModeSettings: {
          ...state.deletionModeSettings,
          genomeIds: action.genomeIds
        } as DeletionModeSettings
      };
    default:
      return state;
  }
};

const SelectedGenomesTable = () => {
  const selectedSpecies = useAppSelector(getCommittedSpecies);
  const [tableState, tableDispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useAppDispatch();

  const isInDeletionMode = Boolean(tableState.deletionModeSettings);
  const genomeIdsForDeletion = new Set<string>(
    tableState.deletionModeSettings?.genomeIds ?? []
  );

  if (!selectedSpecies.length) {
    return <div>You have not selected any species</div>;
  }

  const getLinkToSpeciesPage = (species: CommittedItem) => {
    const { genome_id, genome_tag } = species;
    const idForUrl = genome_tag ?? genome_id;
    return urlFor.speciesPage({ genomeId: idForUrl });
  };

  const getSpeciesLinkAriaLabel = (species: CommittedItem) => {
    const { scientific_name, assembly } = species;
    return `Home page for ${scientific_name}, ${assembly.name}`;
  };

  const enterDeletionMode = (species: CommittedItem) => {
    tableDispatch({
      type: 'enter-deletion-mode',
      genomeId: species.genome_id
    });
  };

  const exitDeletionMode = () => {
    tableDispatch({
      type: 'exit-deletion-mode'
    });
  };

  const addGenomeToDeleteList = (genome: CommittedItem) => {
    const currentGenomeIdsList =
      tableState.deletionModeSettings?.genomeIds ?? [];
    const updatedList = [...currentGenomeIdsList, genome.genome_id];
    tableDispatch({
      type: 'update-deletion-list',
      genomeIds: updatedList
    });
  };

  const removeGenomeFromDeleteList = (genome: CommittedItem) => {
    const currentGenomeIdsList =
      tableState.deletionModeSettings?.genomeIds ?? [];
    const updatedList = currentGenomeIdsList.filter(
      (genomeId) => genomeId !== genome.genome_id
    );
    tableDispatch({
      type: 'update-deletion-list',
      genomeIds: updatedList
    });
  };

  const deleteGenomes = () => {
    const genomeIdsForDeletion =
      tableState.deletionModeSettings?.genomeIds ?? [];

    for (const genomeId of genomeIdsForDeletion) {
      reduxDispatch(deleteSpeciesAndSave(genomeId));
    }
    exitDeletionMode();
  };

  const toggleGenomeUse = (genome: CommittedItem) => {
    reduxDispatch(toggleSpeciesUseAndSave(genome.genome_id));
  };

  return (
    <Table stickyHeader={true} className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Species home page</ColumnHead>
          <ColumnHead>Common name</ColumnHead>
          <ColumnHead>Scientific name</ColumnHead>
          <ColumnHead>Type</ColumnHead>
          <ColumnHead>Assembly</ColumnHead>
          <ColumnHead>Assembly accession</ColumnHead>
          <ColumnHead>Remove from list</ColumnHead>
          <ColumnHead>Use in apps</ColumnHead>
        </tr>
      </thead>
      <tbody>
        {selectedSpecies.map((species) => (
          <Fragment key={species.genome_id}>
            <tr
              key={species.genome_id}
              className={isInDeletionMode ? styles.disabledRow : undefined}
            >
              <td className={styles.alignCenter}>
                <Link to={getLinkToSpeciesPage(species)}>
                  <HomeIcon
                    className={styles.homeIcon}
                    role="img"
                    aria-label={getSpeciesLinkAriaLabel(species)}
                  />
                </Link>
              </td>
              <td>
                <CommonName {...species} />
              </td>
              <td>
                <ScientificName {...species} />
              </td>
              <td>
                <SpeciesType {...species} />
              </td>
              <td>
                <AssemblyName {...species} />
              </td>
              <td>
                <AssemblyAccessionId {...species} />
              </td>
              <td className={styles.alignCenter}>
                <DeleteButtonOrCheckbox
                  species={species}
                  isInDeletionMode={isInDeletionMode}
                  enterDeletionMode={enterDeletionMode}
                  addGenomeToDeleteList={addGenomeToDeleteList}
                  removeGenomeFromDeleteList={removeGenomeFromDeleteList}
                  isMarkedForDeletion={genomeIdsForDeletion.has(
                    species.genome_id
                  )}
                />
              </td>
              <td className={styles.alignCenter}>
                <SlideToggle
                  className={styles.toggle}
                  isOn={species.isEnabled}
                  onChange={() => toggleGenomeUse(species)}
                  disabled={isInDeletionMode}
                />
              </td>
            </tr>
            {isInDeletionMode &&
              tableState.deletionModeSettings?.rowDeletionInitiated ===
                species.genome_id && (
                <ConfirmDeletion
                  species={species}
                  tableColumnsCount={8}
                  onDelete={deleteGenomes}
                  onCancel={exitDeletionMode}
                />
              )}
          </Fragment>
        ))}
      </tbody>
    </Table>
  );
};

const DeleteButtonOrCheckbox = ({
  species,
  isInDeletionMode,
  isMarkedForDeletion,
  enterDeletionMode,
  addGenomeToDeleteList,
  removeGenomeFromDeleteList
}: {
  species: CommittedItem;
  isInDeletionMode: boolean;
  isMarkedForDeletion?: boolean;
  enterDeletionMode: (species: CommittedItem) => void;
  addGenomeToDeleteList: (species: CommittedItem) => void;
  removeGenomeFromDeleteList: (species: CommittedItem) => void;
}) => {
  const onCheckboxChange = (isChecked: boolean) => {
    if (isChecked) {
      addGenomeToDeleteList(species);
    } else {
      removeGenomeFromDeleteList(species);
    }
  };

  if (!isInDeletionMode) {
    return <DeleteButton onClick={() => enterDeletionMode(species)} />;
  } else {
    return (
      <Checkbox checked={!!isMarkedForDeletion} onChange={onCheckboxChange} />
    );
  }
};

/**
 * This is visually represented as a table row, which always has two columns
 * (the start of the second column aligns with the second to last column of the table)
 */
const ConfirmDeletion = (props: {
  species: CommittedItem;
  tableColumnsCount: number; // this will be different depending on whether showing all columns or is hiding some
  onDelete: (species: CommittedItem) => void;
  onCancel: () => void;
}) => {
  // this row will use the two rightmost columns of the table,
  // but will merge all the columns to the left
  const cpanColumnsCount = props.tableColumnsCount - 2;

  const onDelete = () => {
    props.onDelete(props.species);
  };

  // FIXME: the colspan on the first td should depend on how many columns the table shows
  return (
    <tr className={styles.removalRow}>
      <td colSpan={cpanColumnsCount}>
        <div className={styles.removalRowContent}>
          <span className={styles.removalWarning}>{removalWarning}</span>
          <PrimaryButton onClick={onDelete}>Remove</PrimaryButton>
        </div>
      </td>
      <td colSpan={2}>
        <button className={styles.cancelGenomeRemoval} onClick={props.onCancel}>
          Do not remove
        </button>
      </td>
    </tr>
  );
};

const removalWarning =
  'Any configuration of views for this species will be lost if you remove it - do you wish to continue?';

export default SelectedGenomesTable;
