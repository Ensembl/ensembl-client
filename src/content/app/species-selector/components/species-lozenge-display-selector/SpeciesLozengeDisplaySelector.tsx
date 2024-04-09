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

import React, { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';

import styles from './SpeciesLozengeDisplaySelector.module.css';
import { setLozengeDisplaySelection } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';
import { getLozengeDisplaySelection } from '../../state/species-selector-general-slice/speciesSelectorGeneralSelectors';

export enum LozengeOptionValues {
  COMMON_ASSEMBLY = 'common_assembly',
  COMMON_TYPE_ASSEMBLY = 'common_type_assembly',
  SCIENTIFIC_ASSEMBLY = 'scientific_assembly',
  SCIENTIFIC_TYPE_ASSEMBLY = 'scientific_type_assembly',
  ACCESSION = 'accession'
}

const lozengeOptions = [
  {
    value: LozengeOptionValues.COMMON_ASSEMBLY,
    label: 'Common name & assembly'
  },
  {
    value: LozengeOptionValues.COMMON_TYPE_ASSEMBLY,
    label: 'Common name, type & assembly'
  },
  {
    value: LozengeOptionValues.SCIENTIFIC_ASSEMBLY,
    label: 'Scientific name & assembly'
  },
  {
    value: LozengeOptionValues.SCIENTIFIC_TYPE_ASSEMBLY,
    label: 'Scientific name, type & assembly'
  },
  {
    value: LozengeOptionValues.ACCESSION,
    label: 'Assembly accession only'
  }
];

const SpeciesLozengeDisplaySelector = () => {
  const dispatch = useAppDispatch();
  const currentSelection = useAppSelector(getLozengeDisplaySelection);

  const onChange = (e: FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    dispatch(setLozengeDisplaySelection(value));
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
