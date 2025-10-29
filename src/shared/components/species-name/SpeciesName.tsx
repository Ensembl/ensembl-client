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
import type { HTMLAttributes } from 'react';

import { useAppSelector } from 'src/store';

import { getSpeciesNameDisplayOption } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import {
  AssemblyAccessionId,
  CommonName,
  ScientificName,
  SpeciesType,
  AssemblyName,
  SpeciesReference
} from '../species-name-parts';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SpeciesNameDisplayOption } from 'src/content/app/species-selector/types/speciesNameDisplayOption';

import styles from './SpeciesName.module.css';

export type Props = HTMLAttributes<HTMLSpanElement> & {
  species: Pick<
    CommittedItem,
    'common_name' | 'scientific_name' | 'assembly' | 'type' | 'is_reference'
  >;
  speciesNameDisplayOption: SpeciesNameDisplayOption;
  tableMode?: boolean;
};

// Exported component that is not connected to redux. For convenience while testing.
export const SpeciesName = (props: Props) => {
  const {
    species,
    speciesNameDisplayOption,
    tableMode,
    className: classNameFromProps,
    ...otherProps
  } = props;

  const componentClasses = classNames(styles.speciesName, classNameFromProps);

  return (
    <span className={componentClasses} {...otherProps}>
      <Content
        species={species}
        displayOption={speciesNameDisplayOption}
        tableMode={tableMode}
      />
    </span>
  );
};

const Content = (props: {
  species: Props['species'];
  displayOption: SpeciesNameDisplayOption;
  tableMode?: boolean;
}) => {
  const { species, displayOption, tableMode } = props;
  const prominentClass = !tableMode ? styles.prominent : undefined;
  const scientificNameClasses = classNames(prominentClass, styles.italic);
  const assemblyClass = tableMode ? styles.assemblyTableMode : styles.assembly;

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
          className={prominentClass}
        />
        <AssemblyName assembly={species.assembly} className={assemblyClass} />
      </>
    );
  } else if (displayOption === 'common-name_type_assembly-name') {
    return (
      <>
        <CommonName
          common_name={species.common_name}
          fallback={scientificNameElement}
          className={prominentClass}
        />
        {!!(species.type || species.is_reference) && (
          <span className={styles.type}>
            <SpeciesType type={species.type} />
            {species.type && species.is_reference && ', '}
            <SpeciesReference {...species} />
          </span>
        )}
        <AssemblyName assembly={species.assembly} className={assemblyClass} />
      </>
    );
  } else if (displayOption === 'scientific-name_assembly-name') {
    return (
      <>
        <ScientificName
          scientific_name={species.scientific_name}
          className={scientificNameClasses}
        />
        <AssemblyName assembly={species.assembly} className={assemblyClass} />
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
        <AssemblyName assembly={species.assembly} className={assemblyClass} />
      </>
    );
  } else if (displayOption === 'assembly-accession-id') {
    return (
      <>
        <AssemblyAccessionId
          assembly={species.assembly}
          className={prominentClass}
        />
      </>
    );
  }
};

const ConnectedSpeciesName = (
  props: Omit<Props, 'speciesNameDisplayOption'>
) => {
  const speciesNameDisplayOption = useAppSelector(getSpeciesNameDisplayOption);

  return (
    <SpeciesName
      {...props}
      speciesNameDisplayOption={speciesNameDisplayOption}
    />
  );
};

// Use the component connected to redux as a default export
export default ConnectedSpeciesName;
