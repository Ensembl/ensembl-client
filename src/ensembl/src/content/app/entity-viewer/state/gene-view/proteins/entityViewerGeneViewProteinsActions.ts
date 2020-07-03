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

import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { getProteinsUI } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsSelectors';
import { getGeneViewContentUI } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';

import { RootState } from 'src/store';
import { View } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';
import { updateActiveGeneViewUIState } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';
import { EntityViewerGeneViewProteinsUI } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsState';

export const updateGeneViewProteinsUIState: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (proteinsContentUI: Partial<EntityViewerGeneViewProteinsUI>) => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();

  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  const contentUI = getGeneViewContentUI(state);

  dispatch(
    updateActiveGeneViewUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        contentUI: {
          ...contentUI,
          [View.PROTEIN]: proteinsContentUI
        }
      }
    })
  );
};

export const toggleProteinInfo: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (transcriptId: string) => (dispatch, getState: () => RootState) => {
  const state = getState();

  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  const expandedProteinIds = getProteinsUI(state)?.expandedProteinIds || [];

  const index = expandedProteinIds.indexOf(transcriptId);

  if (index > -1) {
    expandedProteinIds.splice(index, 1);
  } else {
    expandedProteinIds.push(transcriptId);
  }

  dispatch(
    updateGeneViewProteinsUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        expandedProteinIds
      }
    })
  );
};
