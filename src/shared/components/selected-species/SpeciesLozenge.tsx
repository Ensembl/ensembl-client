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

import React, {
  type DetailedHTMLProps,
  type ButtonHTMLAttributes
} from 'react';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import { getDisplayName } from './selectedSpeciesHelpers';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesLozenge.module.css';

type SpeciesLozengeTheme = 'blue' | 'black' | 'ice-blue' | 'grey' | 'red';

export type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  species: CommittedItem;
  theme: SpeciesLozengeTheme;
};

const SpeciesLozenge = (props: Props) => {
  const {
    species,
    theme,
    className: classNameFromProps,
    ...otherProps
  } = props;
  const displayName = getDisplayName(species);

  const componentClasses = classNames(
    styles.species,
    styles[`theme${upperFirst(camelCase(theme))}`],
    classNameFromProps
  );

  return (
    <button className={componentClasses} {...otherProps}>
      <div className={styles.inner}>
        <span className={styles.name}>{displayName}</span>
        <span className={styles.assembly}>{props.species.assembly.name}</span>
      </div>
    </button>
  );
};

export default SpeciesLozenge;
