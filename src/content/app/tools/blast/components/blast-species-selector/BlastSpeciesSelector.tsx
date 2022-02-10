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
import { useSelector, useDispatch } from 'react-redux';

import {
  addSelectedSpecies,
  removeSelectedSpecies
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesIds } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import SpeciesList from './SpeciesList';

import styles from './BlastSpeciesSelector.scss';

const BlastSpeciesSelector = () => {
  const dispatch = useDispatch();
  const selectedSpecies = useSelector(getSelectedSpeciesIds);

  const onSpeciesSelection = (isChecked: boolean, genomeId: string) => {
    if (isChecked) {
      dispatch(addSelectedSpecies({ genomeId }));
    } else {
      dispatch(removeSelectedSpecies({ genomeId }));
    }
  };

  return (
    <div className={styles.speciesSelector}>
      <table className={styles.speciesSelectorTable}>
        <thead>
          <tr>
            <th className={styles.commonNameHeader}>Common name</th>
            <th className={styles.scientificNameHeader}>Scientific name</th>
            <th className={styles.assemblyHeader}>Assembly</th>
            <th className={styles.selectCol}>Select</th>
          </tr>
        </thead>
        <tbody>
          {SpeciesList.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.common_name ? item.common_name : '-'}</td>
                <td className={styles.scientificNameCol}>
                  {item.scientific_name}
                </td>
                <td className={styles.assemblyCol}>{item.assembly_name}</td>
                <td className={styles.selectCol}>
                  <Checkbox
                    classNames={{
                      unchecked: styles.checkboxUnchecked,
                      checked: styles.checkboxChecked
                    }}
                    checked={selectedSpecies.includes(item.genome_id)}
                    onChange={(isChecked) =>
                      onSpeciesSelection(isChecked, item.genome_id)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BlastSpeciesSelector;
