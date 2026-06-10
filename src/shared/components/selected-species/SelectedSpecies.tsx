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

import classNames from 'classnames';
import type { MouseEvent } from 'react';

import CloseIcon from 'static/icons/icon_close.svg';

import SpeciesLozenge from './SpeciesLozenge';
import { getDisplayName } from './selectedSpeciesHelpers';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SelectedSpecies.module.css';

export type Props = {
  species: CommittedItem;
  isActive?: boolean;
  disabled?: boolean;
  withReleaseInfo?: boolean;
  onClick?: (species: CommittedItem) => void;
  onRemove?: (species: CommittedItem) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
};

const SelectedSpecies = (props: Props) => {
  const onClick = () => {
    props.onClick?.(props.species);
  };

  const onRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    props.onRemove?.(props.species);
  };

  const lozengeClasses = classNames(props.className, {
    [styles.lozengeWithRemoveButton]: props.onRemove
  });

  const speciesLozenge = (
    <SpeciesLozenge
      species={props.species}
      className={lozengeClasses}
      withReleaseInfo={props.withReleaseInfo}
      onClick={onClick}
      {...getSpeciesLozengeProps(props)}
    />
  );

  if (!props.onRemove) {
    return speciesLozenge;
  }

  return (
    <span className={styles.selectedSpecies}>
      {speciesLozenge}
      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        aria-label={`Remove ${getDisplayName(props.species)} from selected species`}
      >
        <CloseIcon />
      </button>
    </span>
  );
};

const getSpeciesLozengeProps = (props: Props) => {
  const { isActive = false, disabled } = props;

  // TODO: add invalid (red) species when we start having them

  if (disabled) {
    return {
      theme: 'grey',
      disabled: true,
      'data-active': true
    } as const;
  }

  if (isActive) {
    return {
      theme: 'black',
      disabled: true,
      'data-active': true
    } as const;
  } else {
    return {
      theme: 'blue'
    } as const;
  }
};

export default SelectedSpecies;
