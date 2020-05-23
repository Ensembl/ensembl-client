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

import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './SpeciesTab.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type Props = {
  species: CommittedItem;
  isActive: boolean;
  onActivate: (genomeId: string) => void;
};

const SpeciesTab = (props: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const {
    genome_id,
    common_name,
    scientific_name,
    assembly_name
  } = props.species;

  const toggleHoverState = (newHoverState: boolean) => {
    if (newHoverState !== isHovering) {
      setIsHovering(newHoverState);
    }
  };

  const handleClick = () => {
    if (!props.isActive) {
      props.onActivate(genome_id);
    }
  };

  const displayName = common_name || scientific_name;
  const isFullSize = props.isActive || isHovering;

  const className = classNames(styles.speciesTab, {
    [styles.speciesTabActive]: props.isActive,
    [styles.speciesTabFullSize]: isFullSize
  });

  return (
    <div
      className={className}
      onMouseEnter={() => toggleHoverState(true)}
      onMouseLeave={() => toggleHoverState(false)}
      onClick={handleClick}
    >
      <span className={styles.name}>{displayName}</span>
      <span className={styles.assembly}>{assembly_name}</span>
    </div>
  );
};

export default SpeciesTab;
