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
  removeSelectedSpecies,
  clearSelectedSpecies
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpeciesList } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { Table, ColumnHead } from 'src/shared/components/table';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import styles from './BlastSelectedSpeciesList.scss';

/**
 * NOTE:
 * It is quite likely that this component that shows a list of selected species
 * will be used in other tools (VEP, etc.); but no designs for other tools
 * have yet been developed.
 * In order to avoid premature abstractions, I am creating this as a BLAST component;
 * but with a view that it will probably need to move to a shared tools component
 * in the future.
 */

type Props = {
  genomes: Species[];
  onClearAll: () => void;
  onGenomeRemove: (genomeId: string) => void;
};

const BlastSelectedSpeciesList = (props: Props) => {
  const { genomes, onClearAll, onGenomeRemove } = props;

  return (
    <div className={styles.container}>
      <Table>
        <thead>
          <tr>
            <ColumnHead>Species</ColumnHead>
            <ColumnHead>Assembly</ColumnHead>
            <ColumnHead>
              <TextButton onClick={onClearAll}>Clear all</TextButton>
            </ColumnHead>
          </tr>
        </thead>
        <tbody>
          {genomes.map((genome) => (
            <tr key={genome.genome_id}>
              <td>{genome.common_name ?? genome.scientific_name}</td>
              <td>{genome.assembly.name}</td>
              <td>
                <DeleteButton
                  onClick={() => onGenomeRemove(genome.genome_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// This is just a redux wrapped over BlastSelectedSpeciesList,
// to make BlastSelectedSpeciesList reusable in the future.
const WrappedBlastSelectedSpeciesList = () => {
  const dispatch = useDispatch();
  const selectedGenomes = useSelector(getSelectedSpeciesList);

  const onClearAll = () => {
    dispatch(clearSelectedSpecies());
  };

  const onGenomeRemove = (genomeId: string) => {
    dispatch(removeSelectedSpecies(genomeId));
  };

  return (
    <BlastSelectedSpeciesList
      genomes={selectedGenomes}
      onClearAll={onClearAll}
      onGenomeRemove={onGenomeRemove}
    />
  );
};

export default WrappedBlastSelectedSpeciesList;
