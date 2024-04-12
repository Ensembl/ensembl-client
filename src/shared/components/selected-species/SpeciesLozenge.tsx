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

import {
  AssemblyAccessionId,
  CommonName,
  ScientificName,
  SpeciesType,
  AssemblyName,
  SpeciesReference
} from '../species-name-parts';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import { type SpeciesNameDisplayOption } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import styles from './SpeciesLozenge.module.css';

type SpeciesLozengeTheme = 'blue' | 'black' | 'ice-blue' | 'grey' | 'red';

export type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  species: CommittedItem;
  speciesNameDisplayOption: SpeciesNameDisplayOption;
  theme: SpeciesLozengeTheme;
};

const SpeciesLozenge = (props: Props) => {
  const {
    species,
    speciesNameDisplayOption,
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
        <LozengeContent
          species={species}
          displayOption={speciesNameDisplayOption}
        />
      </div>
    </button>
  );
};

type DisplayStringProps = {
  species: CommittedItem;
  displayOption: SpeciesNameDisplayOption;
};

const LozengeContent = (props: DisplayStringProps) => {
  const { species, displayOption } = props;
  const scientificNameClasses = classNames(styles.default, styles.italic);

  const scientificNameElement = (
    <ScientificName
      scientific_name={species.scientific_name}
      className={scientificNameClasses}
    />
  );

  if (displayOption === 'common-name_assembly-name') {
    return (
      <>
        <CommonName
          common_name={species.common_name}
          fallback={scientificNameElement}
          className={styles.default}
        />
        <AssemblyName assembly={species.assembly} className={styles.assembly} />
      </>
    );
  } else if (displayOption === 'common-name_type_assembly-name') {
    return (
      <>
        <CommonName
          common_name={species.common_name}
          fallback={scientificNameElement}
          className={styles.default}
        />
        {!!(species.type || species.is_reference) && (
          <span className={styles.type}>
            <SpeciesType type={species.type} />
            {species.type && species.is_reference && ', '}
            <SpeciesReference {...species} />
          </span>
        )}
        <AssemblyName assembly={species.assembly} className={styles.assembly} />
      </>
    );
  } else if (displayOption === 'scientific-name_assembly-name') {
    return (
      <>
        <ScientificName
          scientific_name={species.scientific_name}
          className={scientificNameClasses}
        />
        <AssemblyName assembly={species.assembly} className={styles.assembly} />
      </>
    );
  } else if (displayOption === 'scientific-name_type_assembly-name') {
    return (
      <>
        <ScientificName
          scientific_name={species.scientific_name}
          className={scientificNameClasses}
        />
        {!!(species.type || species.is_reference) && (
          <span>
            <SpeciesType type={species.type} />
            {species.type && species.is_reference && ', '}
            <SpeciesReference {...species} className={styles.italic} />
          </span>
        )}
        <AssemblyName assembly={species.assembly} className={styles.assembly} />
      </>
    );
  } else if (displayOption === 'assembly-accession-id') {
    return (
      <>
        <AssemblyAccessionId
          assembly={species.assembly}
          className={styles.default}
        />
      </>
    );
  }
};

export default SpeciesLozenge;
