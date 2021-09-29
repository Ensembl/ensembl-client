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
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { RootState } from 'src/store';
import {
  TranscriptsStatePerGene,
  Filters,
  SortingRule
} from './geneViewTranscriptsSlice';

const getSliceForGene = (
  state: RootState
): TranscriptsStatePerGene | undefined => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeEntityId = getEntityViewerActiveEntityId(state);
  if (!activeGenomeId || !activeEntityId) {
    return;
  }
  return state.entityViewer.geneView.transcripts[activeGenomeId]?.[
    activeEntityId
  ];
};

export const getExpandedTranscriptIds = (state: RootState): string[] => {
  const transcriptsSlice = getSliceForGene(state);
  return transcriptsSlice?.expandedIds ?? [];
};

export const getExpandedTranscriptDownloadIds = (
  state: RootState
): string[] => {
  const transcriptsSlice = getSliceForGene(state);
  return transcriptsSlice?.expandedDownloadIds ?? [];
};

export const getExpandedTranscriptMoreInfoIds = (
  state: RootState
): string[] => {
  const transcriptsSlice = getSliceForGene(state);
  return transcriptsSlice?.expandedMoreInfoIds ?? [];
};

export const getFilters = (state: RootState): Filters => {
  const transcriptsSlice = getSliceForGene(state);
  return transcriptsSlice?.filters ?? {};
};

export const getSortingRule = (state: RootState): SortingRule => {
  const transcriptsSlice = getSliceForGene(state);
  return transcriptsSlice?.sortingRule ?? SortingRule.DEFAULT;
};

export const getFilterPanelOpen = (state: RootState): boolean => {
  const transcriptsSlice = getSliceForGene(state);
  return transcriptsSlice?.filterPanelOpen ?? false;
};
