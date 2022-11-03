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

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'src/store';

import {
  addSelectedSpecies,
  removeSelectedSpecies
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesList } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { getPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { fetchPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSlice';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import styles from './BlastSpeciesSelector.scss';

const BlastSpeciesSelector = () => {
  const dispatch = useAppDispatch();
  const popularSpeciesList = useAppSelector(getPopularSpecies);
  const selectedSpeciesList = useAppSelector(getSelectedSpeciesList);
  const selectedGenomeIds = selectedSpeciesList.map(
    ({ genome_id }) => genome_id
  );

  useEffect(() => {
    if (!popularSpeciesList) {
      dispatch(fetchPopularSpecies());
    }
  }, [popularSpeciesList]);

  const onSpeciesSelection = (isChecked: boolean, species: Species) => {
    if (isChecked) {
      dispatch(addSelectedSpecies(species));
    } else {
      dispatch(removeSelectedSpecies(species.genome_id));
    }
  };

  const availableSpeciesList = popularSpeciesList.filter(
    (species) => species.scientific_name
  );

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
          {availableSpeciesList.map((species, index) => {
            return (
              <tr key={index}>
                <td>{species.common_name ?? '-'}</td>
                <td className={styles.scientificNameCol}>
                  {species.scientific_name}
                </td>
                <td className={styles.assemblyCol}>{species.assembly_name}</td>
                <td className={styles.selectCol}>
                  <Checkbox
                    checked={selectedGenomeIds.includes(species.genome_id)}
                    onChange={(isChecked) =>
                      onSpeciesSelection(isChecked, species)
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
