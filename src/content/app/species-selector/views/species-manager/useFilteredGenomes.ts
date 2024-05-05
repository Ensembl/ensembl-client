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

import { useState, type FormEvent } from 'react';

import { useAppSelector } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const useFilteredGenomes = () => {
  const selectedGenomes = useAppSelector(getCommittedSpecies);
  const [filteredGenomes, setFilteredGenomes] = useState(selectedGenomes);

  const onFilterChange = (event: FormEvent<HTMLInputElement>) => {
    const filterString = event.currentTarget.value;
    const filteredGenomes = selectedGenomes.filter((genome) => {
      return doesGenomeMatchQuery(genome, filterString);
    });
    setFilteredGenomes(filteredGenomes);
  };

  return {
    allSelectedGenomes: selectedGenomes,
    filteredGenomes,
    onFilterChange
  };
};

const doesGenomeMatchQuery = (genome: CommittedItem, query: string) => {
  const fields = [
    genome.common_name,
    genome.scientific_name,
    genome.assembly.name,
    genome.assembly.accession_id,
    genome.type?.kind,
    genome.type?.value
  ].filter(Boolean) as string[];

  for (const field of fields) {
    if (field.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
      return true;
    }
  }

  return false;
};

export default useFilteredGenomes;
