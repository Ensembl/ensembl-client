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
  View,
  ViewStatePerGene,
  GeneViewTabData,
  GeneViewTabMap,
  SelectedTabViews
} from './geneViewViewSlice';

const getSliceForGene = (state: RootState): ViewStatePerGene | undefined => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEntityId(state);
  if (!activeGenomeId || !activeObjectId) {
    return;
  }
  return state.entityViewer.geneView.view[activeGenomeId]?.[activeObjectId];
};

export const getCurrentView = (state: RootState) => {
  return getSliceForGene(state)?.current;
};

export const getAllGeneViews = (state: RootState) =>
  state.entityViewer.geneView.view;

export const getSelectedGeneViewTabs = (state: RootState): GeneViewTabData => {
  const view = getCurrentView(state);
  return view
    ? (GeneViewTabMap.get(view) as GeneViewTabData)
    : (GeneViewTabMap.get(View.TRANSCRIPTS) as GeneViewTabData);
};

export const getSelectedTabViews = (
  state: RootState
): SelectedTabViews | undefined => {
  return getSliceForGene(state)?.selectedTabViews;
};
