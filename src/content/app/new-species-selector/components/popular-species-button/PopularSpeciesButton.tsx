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

import useHover from 'src/shared/hooks/useHover';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import type { PopularSpecies } from 'src/content/app/new-species-selector/types/popularSpecies';

import styles from './PopularSpeciesButton.scss';

export type Props = {
  species: PopularSpecies;
  onClick: (species: PopularSpecies) => void;
};

const PopularSpeciesButton = (props: Props) => {
  const { species } = props;
  const [hoverRef, isHovered] = useHover<HTMLButtonElement>();

  const handleClick = () => {
    props.onClick(species);
  };

  const buttonClasses = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonSelected]: species.is_selected
  });

  return (
    <button className={buttonClasses} ref={hoverRef} onClick={handleClick}>
      <img src={species.image} />
      {species.members_count > 1 && (
        <span className={styles.membersCount}>{species.members_count}</span>
      )}
      {isHovered && (
        <Tooltip anchor={hoverRef.current} autoAdjust={true}>
          {species.name}
        </Tooltip>
      )}
    </button>
  );
};

export default PopularSpeciesButton;
