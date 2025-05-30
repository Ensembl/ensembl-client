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

import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from 'src/store';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SpeciesNameDisplayOption } from 'src/content/app/species-selector/types/speciesNameDisplayOption';

export const getCommittedSpecies = createSelector(
  (state: RootState) => state.speciesSelector.general.committedItems,
  (committedItems) => {
    return committedItems.toSorted(
      (species1, species2) => species2.selectedAt - species1.selectedAt
    );
  }
);

export const getSpeciesNameDisplayOption = (
  state: RootState
): SpeciesNameDisplayOption => {
  return state.speciesSelector.general.speciesNameDisplayOption;
};

export const getCommittedSpeciesById = (
  state: RootState,
  genomeId: string | null
): CommittedItem | null => {
  if (!genomeId) {
    return null;
  }
  const allCommittedSpecies = getCommittedSpecies(state);
  return (
    allCommittedSpecies.find((species) => genomeId === species.genome_id) ??
    null
  );
};

export const getEnabledCommittedSpecies = createSelector(
  (state: RootState) => getCommittedSpecies(state),
  (committedSpecies) => committedSpecies.filter(({ isEnabled }) => isEnabled)
);

/**
 * Identifies ids of the assemblies each of which has more than one genome
 * among the saved species
 */
export const getAssembliesWithMultipleCommittedGenomes = createSelector(
  (state: RootState) => getCommittedSpecies(state),
  (committedSpeciesList) => {
    const seenAssemblyIds = new Set<string>();
    const finalAssemblyIdsSet = new Set<string>();

    for (const species of committedSpeciesList) {
      const assemblyId = species.assembly.accession_id;
      if (seenAssemblyIds.has(assemblyId)) {
        finalAssemblyIdsSet.add(assemblyId);
      } else {
        seenAssemblyIds.add(assemblyId);
      }
    }

    return finalAssemblyIdsSet;
  }
);
