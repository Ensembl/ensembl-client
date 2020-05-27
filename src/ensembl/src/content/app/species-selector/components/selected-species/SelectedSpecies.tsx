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

import React, { FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import ClearButton from 'src/shared/components/clear-button/ClearButton';

import styles from './SelectedSpecies.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

export type Props = {
  species: CommittedItem;
  onToggleUse: (genomeId: string) => void;
  onRemove: (genomeId: string) => void;
};

const SelectedSpecies: FunctionComponent<Props> = (props) => {
  const [hovered, setHovered] = useState(false);
  const setHoveredState = () => setHovered(true);
  const setUnhoveredState = () => setHovered(false);

  const {
    common_name,
    scientific_name,
    assembly_name,
    isEnabled
  } = props.species;

  const displayName = common_name || scientific_name;

  const className = classNames(styles.selectedSpecies, {
    [styles.selectedSpeciesDisabled]: !isEnabled
  });

  return (
    <div
      className={className}
      onMouseOver={setHoveredState}
      onMouseLeave={setUnhoveredState}
    >
      <span className={styles.name}>{displayName}</span>
      <span className={styles.assembly}>{assembly_name}</span>
      {hovered && <SelectedSpeciesOverlay {...props} />}
    </div>
  );
};

const SelectedSpeciesOverlay: FunctionComponent<Props> = (props) => {
  const { genome_id, isEnabled } = props.species;

  const text = isEnabled ? 'Do not use' : 'Use';

  const handleClick = () => {
    props.onToggleUse(genome_id);
  };
  const removeSpecies = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.onRemove(genome_id);
  };

  return (
    <div className={styles.selectedSpeciesOverlay}>
      <span className={styles.overlayText} onClick={handleClick}>
        {text}
      </span>
      <div className={styles.clearButtonContainer} onClick={removeSpecies}>
        <ClearButton inverted={true} onClick={noop} />
      </div>
    </div>
  );
};

export default SelectedSpecies;
