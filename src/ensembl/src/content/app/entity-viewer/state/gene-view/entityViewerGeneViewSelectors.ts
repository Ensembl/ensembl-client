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

import { RootState } from 'src/store';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import {
  EntityViewerGeneViewUIState,
  transcriptsTabData,
  GeneViewTabMap,
  GeneViewTabData,
  SelectedTabViews
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

export const getGeneViewState = (
  state: RootState
): EntityViewerGeneViewUIState | undefined => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  return state.entityViewer.geneView[activeGenomeId]?.[activeObjectId];
};

export const getGeneViewName = (state: RootState) =>
  getGeneViewState(state)?.view;

export const getSelectedGeneViewTabs = (state: RootState): GeneViewTabData => {
  const view = getGeneViewName(state);
  return view
    ? (GeneViewTabMap.get(view) as GeneViewTabData)
    : transcriptsTabData;
};

export const getSelectedTabViews = (
  state: RootState
): SelectedTabViews | undefined => {
  return getGeneViewState(state)?.selectedTabViews;
};

export const getGeneViewContentUI = (state: RootState) => {
  return getGeneViewState(state)?.contentUI;
};
