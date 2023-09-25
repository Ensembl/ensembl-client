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

import { useAppSelector } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

export type SelectableGenome = SpeciesSearchMatch & {
  isSelected: boolean;
  isPreselected: boolean;
};

const useSelectableGenomesTable = (genomes: SpeciesSearchMatch[]) => {
  const [preselectedGenomes, setPreselectedGenomes] = useState<
    SpeciesSearchMatch[]
  >([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const selectableGenomes = useMarkedGenomes(genomes, preselectedGenomes);

  const onGenomePreselectToggle = (
    genome: SpeciesSearchMatch,
    isAdding?: boolean
  ) => {
    if (isAdding) {
      setPreselectedGenomes([...preselectedGenomes, genome]);
    } else {
      const updatedList = preselectedGenomes.filter(
        ({ genome_id }) => genome_id !== genome.genome_id
      );
      setPreselectedGenomes(updatedList);
    }
  };

  const onTableExpandToggle = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  return {
    genomes: selectableGenomes,
    preselectedGenomes,
    onGenomePreselectToggle,
    isTableExpanded,
    onTableExpandToggle,
    setPreselectedGenomes
  };
};

/**
 * Enrich genome data by marking them as selected or preselected.
 * A selected genome is the one that the user has already added to the list of the selected genomes.
 * A pre-selected genome is a genome that the user has ticked but has not yet confirmed (not yet pressed the "Add" button).
 */
const useMarkedGenomes = (
  genomes: SpeciesSearchMatch[],
  preselectedGenomes: SpeciesSearchMatch[]
): SelectableGenome[] => {
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const committedSpeciesIds = new Set(
    committedSpecies.map((species) => species.genome_id)
  );
  const preselectedGenomeIds = useMemo(() => {
    const ids = preselectedGenomes.map((genome) => genome.genome_id);
    return new Set(ids);
  }, [preselectedGenomes]);

  return genomes.map((genome) => ({
    ...genome,
    isSelected: committedSpeciesIds.has(genome.genome_id),
    isPreselected: preselectedGenomeIds.has(genome.genome_id)
  }));
};

export default useSelectableGenomesTable;
