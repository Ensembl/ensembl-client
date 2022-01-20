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

import {
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';
import { CurrentItem } from 'src/content/app/species-selector/state/speciesSelectorSlice';
import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

export const getSpeciesAnalyticsName = (
  species: CommittedItem | CurrentItem | PopularSpecies | SearchMatch
) => {
  return `${species.common_name || species.scientific_name} - ${
    species.assembly_name
  }`;
};