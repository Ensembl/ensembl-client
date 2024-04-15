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
import { useAppSelector } from 'src/store';

import SpeciesLozenge from './SpeciesLozenge';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import { getSpeciesNameDisplayOption } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

export type Props = {
  species: CommittedItem;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (species: CommittedItem) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
};

const SelectedSpecies = (props: Props) => {
  const onClick = () => {
    props.onClick?.(props.species);
  };

  const speciesNameDisplayOptionOption = useAppSelector(
    getSpeciesNameDisplayOption
  );

  return (
    <SpeciesLozenge
      species={props.species}
      speciesNameDisplayOption={speciesNameDisplayOptionOption}
      className={props.className}
      onClick={onClick}
      {...getSpeciesLozengeProps(props)}
    />
  );
};

const getSpeciesLozengeProps = (props: Props) => {
  const {
    isActive = false,
    species: { isEnabled },
    disabled
  } = props;

  // TODO: add invalid (red) species when we start having them

  if (disabled) {
    return {
      theme: 'grey',
      disabled: true,
      'data-active': true
    } as const;
  }

  if (isActive && isEnabled) {
    return {
      theme: 'black',
      disabled: true,
      'data-active': true
    } as const;
  } else if (isActive && !isEnabled) {
    return {
      theme: 'grey',
      disabled: true,
      'data-active': true
    } as const;
  } else if (!isActive && isEnabled) {
    return {
      theme: 'blue'
    } as const;
  } else {
    return {
      theme: 'ice-blue'
    } as const;
  }
};

export default SelectedSpecies;
