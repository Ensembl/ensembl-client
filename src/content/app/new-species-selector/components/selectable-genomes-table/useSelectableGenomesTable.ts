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

import { useState, useMemo } from 'react';

import useOrderedGenomes from './useOrderedGenomes';

import filterGenomes from './filterGenomes';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

export type SelectableGenome = SpeciesSearchMatch & {
  isSelected: boolean;
  isStaged: boolean;
};

type Params = {
  genomes: SpeciesSearchMatch[];
  selectedGenomes: Array<{ genome_id: string }>;
  filterQuery?: string;
};

const useSelectableGenomesTable = (params: Params) => {
  const { genomes, selectedGenomes, filterQuery } = params;
  const [stagedGenomes, setStagedGenomes] = useState<SpeciesSearchMatch[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const filteredGenomes = filterQuery
    ? filterGenomes({ query: filterQuery, genomes })
    : genomes;
  const selectableGenomes = useMarkedGenomes({
    genomes: filteredGenomes,
    selectedGenomes,
    stagedGenomes
  });
  const { orderedGenomes, sortRule, changeSortRule } =
    useOrderedGenomes(selectableGenomes);

  const onGenomeStageToggle = (
    genome: SpeciesSearchMatch,
    isAdding?: boolean
  ) => {
    if (isAdding) {
      setStagedGenomes([...stagedGenomes, genome]);
    } else {
      const updatedList = stagedGenomes.filter(
        ({ genome_id }) => genome_id !== genome.genome_id
      );
      setStagedGenomes(updatedList);
    }
  };

  const onTableExpandToggle = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  return {
    genomes: orderedGenomes,
    stagedGenomes,
    onGenomeStageToggle,
    isTableExpanded,
    onTableExpandToggle,
    setStagedGenomes,
    sortRule,
    changeSortRule
  };
};

/**
 * Enrich genome data by marking them as selected or preselected.
 * A selected genome is the one that the user has already added to the list of the selected genomes.
 * A pre-selected genome is a genome that the user has ticked but has not yet confirmed (not yet pressed the "Add" button).
 */
const useMarkedGenomes = (params: {
  genomes: SpeciesSearchMatch[];
  selectedGenomes: Array<{ genome_id: string }>;
  stagedGenomes: SpeciesSearchMatch[];
}): SelectableGenome[] => {
  const { genomes, selectedGenomes, stagedGenomes } = params;
  const selectedGenomeIds = new Set(
    selectedGenomes.map(({ genome_id }) => genome_id)
  );
  const stagedGenomeIds = useMemo(() => {
    const ids = stagedGenomes.map((genome) => genome.genome_id);
    return new Set(ids);
  }, [stagedGenomes]);

  return genomes.map((genome) => ({
    ...genome,
    isSelected: selectedGenomeIds.has(genome.genome_id),
    isStaged: stagedGenomeIds.has(genome.genome_id)
  }));
};

export default useSelectableGenomesTable;
