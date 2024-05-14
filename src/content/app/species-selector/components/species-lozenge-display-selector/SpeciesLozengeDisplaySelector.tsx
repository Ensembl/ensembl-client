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

import type { FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';

import { setSpeciesNameDisplayOption } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';
import { getSpeciesNameDisplayOption } from '../../state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import type { SpeciesNameDisplayOption } from 'src/content/app/species-selector/types/speciesNameDisplayOption';

import styles from './SpeciesLozengeDisplaySelector.module.css';

type LozengeOptionType = {
  value: SpeciesNameDisplayOption;
  label: string;
};

const lozengeOptions: LozengeOptionType[] = [
  {
    value: 'common-name_assembly-name',
    label: 'Common name & assembly'
  },
  {
    value: 'common-name_type_assembly-name',
    label: 'Common name, type & assembly'
  },
  {
    value: 'scientific-name_assembly-name',
    label: 'Scientific name & assembly'
  },
  {
    value: 'scientific-name_type_assembly-name',
    label: 'Scientific name, type & assembly'
  },
  {
    value: 'assembly-accession-id',
    label: 'Assembly accession only'
  }
];

const SpeciesLozengeDisplaySelector = () => {
  const dispatch = useAppDispatch();
  const currentSelection = useAppSelector(getSpeciesNameDisplayOption);

  const onChange = (e: FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value as SpeciesNameDisplayOption;
    dispatch(setSpeciesNameDisplayOption(value));
  };
  return (
    <div className={styles.grid}>
      <label className={styles.label}>Species tabs show</label>
      <SimpleSelect
        value={currentSelection}
        onInput={onChange}
        options={lozengeOptions}
      />
    </div>
  );
};

export default SpeciesLozengeDisplaySelector;
