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

import { openSpeciesSearchModal } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesList } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import AddButton from 'src/shared/components/add-button/AddButton';

import { BLAST_MAX_SPECIES_COUNT } from 'src/content/app/tools/blast/constants/blastFormConstants';

import styles from './BlastSelectedSpeciesListHeader.scss';

export type Props = {
  compact: boolean;
  onSpeciesAdd: () => void;
  canAddSpecies: boolean;
  selectedSpeciesCount: number;
  maxSpeciesCount: number;
};

const BlastSelectedSpeciesListHeader = (props: Props) => {
  const {
    compact,
    onSpeciesAdd,
    canAddSpecies,
    selectedSpeciesCount,
    maxSpeciesCount
  } = props;

  const componentClass = classNames(styles.container, {
    [styles.containerSmallScreen]: compact
  });

  return (
    <div className={componentClass}>
      <div className={styles.titleWithCounter}>
        <span className={styles.title}>Blast against</span>
        <span className={styles.speciesCounter}>{selectedSpeciesCount}</span>
        <span className={styles.maxSpecies}>
          of {maxSpeciesCount} species (max)
        </span>
      </div>
      <AddButton
        disabled={!canAddSpecies}
        className={styles.addButton}
        onClick={onSpeciesAdd}
      >
        Add a species
      </AddButton>
    </div>
  );
};

type WrapperProps = {
  compact: boolean;
};

// Wrapping the header component in redux to make the header component itself more reusable if required
const WrappedBlastSelectedSpeciesListHeader = (props: WrapperProps) => {
  const dispatch = useDispatch();

  const selectedSpeciesList = useSelector(getSelectedSpeciesList);

  const showBlastSpeciesSelector = () => {
    dispatch(openSpeciesSearchModal());
  };

  return (
    <BlastSelectedSpeciesListHeader
      {...props}
      canAddSpecies={selectedSpeciesList.length < BLAST_MAX_SPECIES_COUNT}
      onSpeciesAdd={showBlastSpeciesSelector}
      selectedSpeciesCount={selectedSpeciesList.length}
      maxSpeciesCount={BLAST_MAX_SPECIES_COUNT}
    />
  );
};

export default WrappedBlastSelectedSpeciesListHeader;
