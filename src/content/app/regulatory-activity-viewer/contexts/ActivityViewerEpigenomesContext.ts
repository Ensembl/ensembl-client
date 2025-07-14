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

import type {
  Epigenome,
  LabelledEpigenome
} from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { EpigenomeMetadataDimensionsResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

type ActivityViewerEpigenomesContextType = {
  isLoading: boolean;
  isError: boolean;
  baseEpigenomes: Epigenome[] | null;
  filteredCombinedEpigenomes: Epigenome[] | null;
  sortedCombinedEpigenomes: LabelledEpigenome[] | null;
  epigenomeSortingDimensions: string[] | null; // List of up to three dimensions actually used to sort epigenomes
  allEpigenomeSortableDimensions: string[] | null; // List of all dimensions from which the sorting dimensions can be selected
  epigenomeCombiningDimensions: string[]; // List of dimensions to ignore when distinguishing between epigenomes. Selected by user. Starts as empty list
  epigenomeMetadataDimensionsResponse: EpigenomeMetadataDimensionsResponse | null;
};

const defaultContext: ActivityViewerEpigenomesContextType = {
  isLoading: false,
  isError: false,
  baseEpigenomes: null,
  filteredCombinedEpigenomes: null, // these are the epigenomes that are displayed in the table of selected epigenomes, and are used to fetch activity data
  sortedCombinedEpigenomes: null,
  epigenomeSortingDimensions: null,
  allEpigenomeSortableDimensions: null,
  epigenomeCombiningDimensions: [],
  epigenomeMetadataDimensionsResponse: null
};

export const ActivityViewerEpigenomesContext =
  createContext<ActivityViewerEpigenomesContextType>(defaultContext);
