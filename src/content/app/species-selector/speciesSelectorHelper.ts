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

import { Pick2 } from 'ts-multipick';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

type GenomeDataForAnalytics = Pick<CommittedItem, 'scientific_name'> &
  Pick2<CommittedItem, 'assembly', 'accession_id'>;

export const getSpeciesAnalyticsName = (species: GenomeDataForAnalytics) => {
  return `${species.scientific_name} - ${species.assembly.accession_id}`;
};
