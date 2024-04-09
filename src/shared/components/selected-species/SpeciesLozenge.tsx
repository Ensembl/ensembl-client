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

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import { LozengeOptionValues } from 'src/content/app/species-selector/components/species-lozenge-display-selector/SpeciesLozengeDisplaySelector';

import styles from './SpeciesLozenge.module.css';

type SpeciesLozengeTheme = 'blue' | 'black' | 'ice-blue' | 'grey' | 'red';

export type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  species: CommittedItem;
  view: string;
  theme: SpeciesLozengeTheme;
};

const SpeciesLozenge = (props: Props) => {
  const {
    species,
    view,
    theme,
    className: classNameFromProps,
    ...otherProps
  } = props;

  const componentClasses = classNames(
    styles.species,
    styles[`theme${upperFirst(camelCase(theme))}`],
    classNameFromProps
  );

  return (
    <button className={componentClasses} {...otherProps}>
      <div className={styles.inner}>
        <LozengeContent species={species} view={view} />
      </div>
    </button>
  );
};

type DisplayStringProps = {
  species: CommittedItem;
  view: string;
};

const LozengeContent = (props: DisplayStringProps) => {
  const { species, view } = props;
  if (view === LozengeOptionValues.COMMON_ASSEMBLY) {
    return (
      <>
        <span className={styles.default}>{species.common_name}</span>
        <span className={styles.assembly}>{species.assembly.name}</span>
      </>
    );
  } else if (view === LozengeOptionValues.COMMON_TYPE_ASSEMBLY) {
    return (
      <>
        <span className={styles.default}>{species.common_name}</span>
        {species.type?.value ? (
          <span className={styles.type}> {species.type?.value}</span>
        ) : null}
        <span className={styles.assembly}>{species.assembly.name}</span>
      </>
    );
  } else if (view === LozengeOptionValues.SCIENTIFIC_ASSEMBLY) {
    return (
      <>
        <span className={styles.scientificName}>{species.scientific_name}</span>
        <span className={styles.assembly}>{species.assembly.name}</span>
      </>
    );
  } else if (view === LozengeOptionValues.SCIENTIFIC_TYPE_ASSEMBLY) {
    return (
      <>
        <span className={styles.scientificName}>{species.scientific_name}</span>
        {species.type?.value ? (
          <span className={styles.type}> {species.type?.value}</span>
        ) : null}
        <span className={styles.assembly}>{species.assembly.name}</span>
      </>
    );
  } else if (view === LozengeOptionValues.ACCESSION) {
    return (
      <>
        <span className={styles.default}>{species.assembly.accession_id}</span>
      </>
    );
  }
};

export default SpeciesLozenge;
