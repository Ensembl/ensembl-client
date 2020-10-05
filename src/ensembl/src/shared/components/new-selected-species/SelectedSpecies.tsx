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

import SelectedSpeciesContent from './SelectedSpeciesContent';

import styles from './SelectedSpecies.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

export type Props = {
  species: CommittedItem;
  isActive: boolean;
  onClick: (genomeId: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
};

const chooseClassName = (props: Props) => {
  const {
    isActive,
    species: { isEnabled }
  } = props;

  if (isActive && isEnabled) {
    return styles.inUseActive;
  } else if (isActive && !isEnabled) {
    return styles.notInUseActive;
  } else if (!isActive && isEnabled) {
    return styles.inUseInactive;
  } else {
    return styles.notInUseInactive;
  }
};

const SelectedSpecies = (props: Props) => {
  const handleMouseEnter = () => {
    props.onMouseEnter && props.onMouseEnter();
  };

  const handleMouseLeave = () => {
    props.onMouseLeave && props.onMouseLeave();
  };

  const handleClick = () => {
    if (!props.isActive) {
      props.onClick(props.species.genome_id);
    }
  };

  const className = classNames(
    styles.species,
    chooseClassName(props),
    props.className
  );

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <SelectedSpeciesContent species={props.species} />
    </div>
  );
};

SelectedSpecies.defaultProps = {
  isActive: false
};

export default SelectedSpecies;
