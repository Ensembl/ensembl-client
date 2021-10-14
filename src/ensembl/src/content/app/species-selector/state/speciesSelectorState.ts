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

import { LoadingState } from 'src/shared/types/loading-state';
import {
  SearchMatches,
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';

export type CurrentItem = {
  genome_id: string; // changes every time we update strain or assembly
  reference_genome_id: string | null;
  common_name: string | null;
  scientific_name: string;
  assembly_name: string | null; // name of the selected assembly
};

export type SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState;
  };
  ui: {
    isSelectingStrain: boolean;
  };
  search: {
    text: string;
    results: SearchMatches[] | null;
  };
  currentItem: CurrentItem | null;
  committedItems: CommittedItem[];
  popularSpecies: PopularSpecies[];
};

const initialState: SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState.NOT_REQUESTED
  },
  ui: {
    isSelectingStrain: false
  },
  search: {
    text: '',
    results: null
  },
  currentItem: null,
  committedItems: [],
  popularSpecies: []
};

export default initialState;
