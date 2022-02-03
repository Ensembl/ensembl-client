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
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { updateSelectedSpecies } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpecies } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import styles from './SpeciesSelector.scss';

type SpeciesList = {
  assembly_name: string;
  common_name: string | null;
  genome_id: string;
  scientific_name: string;
};

export type Props = { speciesList: SpeciesList[] };

const SpeciesSelector = (props: Props) => {
  const { speciesList } = props;

  speciesList.sort((a, b) => {
    if (a.common_name) {
      if (a.common_name && b.common_name) {
        return a.common_name > b.common_name ? 1 : -1;
      }
      return -1;
    } else {
      if (!a.common_name && !b.common_name) {
        return a.scientific_name > b.scientific_name ? 1 : -1;
      }
      return 1;
    }
  });

  const dispatch = useDispatch();
  const selectedSpecies = useSelector(getSelectedSpecies);

  const onSpeciesSelection = (isChecked: boolean, genomeId: string) => {
    dispatch(updateSelectedSpecies({ isChecked, genomeId }));
  };

  return (
    <div className={styles.speciesSelectorPlaceholder}>
      <table className={styles.speciesSelectorTable}>
        <thead>
          <tr>
            <th
              className={classNames(
                styles.speciesDetails,
                styles.commonNameHeader
              )}
            >
              Common name
            </th>
            <th
              className={classNames(
                styles.speciesDetails,
                styles.scientificNameHeader
              )}
            >
              Scientific name
            </th>
            <th
              className={classNames(
                styles.speciesDetails,
                styles.assemblyHeader
              )}
            >
              Assembly
            </th>
            <th className={styles.selectCol}>Select</th>
          </tr>
        </thead>
        <tbody>
          {speciesList.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.common_name ? item.common_name : '-'}</td>
                <td className={styles.scientificNameCol}>
                  {item.scientific_name}
                </td>
                <td>{item.assembly_name}</td>
                <td className={styles.selectCol}>
                  <Checkbox
                    classNames={{
                      unchecked: styles.checkboxUnchecked,
                      checked: styles.checkboxChecked
                    }}
                    checked={!!selectedSpecies[item.genome_id]}
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

export default SpeciesSelector;
