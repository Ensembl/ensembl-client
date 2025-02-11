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

import { createContext } from 'react';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

type ActivityViewerIdContextType = {
  genomeIdInUrl?: string;
  activeGenomeId: string | null;
  genomeId?: string; // <-- disambiguated genome id retrieved from the 'explain' endpoint of the metadata api
  genomeIdForUrl?: string;
  assemblyAccessionId: string | null;
  assemblyName: string | null; // <-- temporary data; won't be needed when all regulation endpoints switch to using assembly accession id
  location: GenomicLocation | null; // not quite sure if location belongs here; but provisionally placing it here
  locationForUrl?: string | null;
  isFetchingGenomeId: boolean;
  isMissingGenomeId: boolean;
};

const defaultContext: ActivityViewerIdContextType = {
  activeGenomeId: null,
  assemblyAccessionId: null,
  assemblyName: null,
  location: null,
  isFetchingGenomeId: false,
  isMissingGenomeId: false
};

export const ActivityViewerIdContext =
  createContext<ActivityViewerIdContextType>(defaultContext);
