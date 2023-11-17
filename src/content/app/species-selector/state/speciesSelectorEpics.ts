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

import { Epic } from 'redux-observable';
import { map, tap, filter } from 'rxjs';
import { isFulfilled, type Action } from '@reduxjs/toolkit';

import { saveMultipleSelectedSpecies } from 'src/content/app/species-selector/services/speciesSelectorStorageService';

import {
  getCommittedSpecies,
  getCommittedSpeciesById
} from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getGenomes } from 'src/shared/state/genome/genomeSelectors';

import {
  updateCommittedSpecies,
  loadStoredSpecies
} from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';
import { fetchGenomeSummary } from 'src/shared/state/genome/genomeApiSlice';

import type { RootState } from 'src/store';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

/**
 * When information about a genome is fetched:
 * - check that this genome exists among committed species
 * - if it doesn't, use the fetched information to add this genome to the list of committed species
 * - and save the updated list of committed species to the browser storage
 */
export const ensureCommittedSpeciesEpic: Epic<Action, Action, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(fetchGenomeSummary.matchFulfilled),
    map((action) => {
      const state = state$.value;
      return {
        action,
        state
      };
    }),
    filter(({ action, state }) => {
      // check that the genome is not among committed species
      const genomeId = action.payload.genome_id;
      const speciesAlreadyCommitted = getCommittedSpeciesById(state, genomeId);
      return !speciesAlreadyCommitted;
    }),
    map(({ action, state }) => {
      const genomeInfo = action.payload;
      const newSpecies = buildCommittedItemFromBriefGenomeSummary(genomeInfo);
      const allCommittedSpecies = [...getCommittedSpecies(state), newSpecies];
      return allCommittedSpecies;
    }),
    tap((allCommittedSpecies) => {
      saveMultipleSelectedSpecies(allCommittedSpecies);
    }),
    map((allCommittedSpecies) => {
      return updateCommittedSpecies(allCommittedSpecies);
    })
  );

/**
 * If a genome is fetched during server-side rendering,
 * ensureCommittedSpeciesEpic won't run,
 * and the genome will not get added to the list of selected species,
 * nor will be saved to the browser storage.
 *
 * This epic is intended to run after selected species have been read back
 * from user's browser storage. It compares the list of selected species
 * with the list of fetched genomes in the redux storage; and if it finds genomes
 * that are not among in the selected species list, it adds them to this list.
 */

export const checkLoadedSpeciesEpic: Epic<Action, Action, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isFulfilled(loadStoredSpecies)),
    map((action) => {
      const state = state$.value;
      const allGenomes = Object.values(getGenomes(state));
      const committedSpecies = action.payload;
      const uncommittedGenomes = allGenomes.filter(
        ({ genome_id }) =>
          !committedSpecies.find((species) => species.genome_id === genome_id)
      );
      return {
        action,
        state,
        uncommittedGenomes
      };
    }),
    filter(({ uncommittedGenomes }) => {
      // check that the genome is not among committed species
      return uncommittedGenomes.length > 0;
    }),
    map(({ state, uncommittedGenomes }) => {
      const newSpecies = uncommittedGenomes.map(
        buildCommittedItemFromBriefGenomeSummary
      );
      const allCommittedSpecies = [
        ...getCommittedSpecies(state),
        ...newSpecies
      ];
      return allCommittedSpecies;
    }),
    tap((allCommittedSpecies) => {
      saveMultipleSelectedSpecies(allCommittedSpecies);
    }),
    map((allCommittedSpecies) => {
      return updateCommittedSpecies(allCommittedSpecies);
    })
  );

const buildCommittedItemFromBriefGenomeSummary = (
  genome: BriefGenomeSummary
): CommittedItem => {
  return {
    genome_id: genome.genome_id,
    genome_tag: genome.genome_tag,
    common_name: genome.common_name,
    scientific_name: genome.scientific_name,
    species_taxonomy_id: genome.species_taxonomy_id,
    type: genome.type,
    is_reference: genome.is_reference,
    assembly: {
      accession_id: genome.assembly.accession_id,
      name: genome.assembly.name
    },
    isEnabled: true
  };
};
