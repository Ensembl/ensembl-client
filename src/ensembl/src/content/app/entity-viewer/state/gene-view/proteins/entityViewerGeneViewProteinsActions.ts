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

import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { getProteinsUI } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsSelectors';

import { RootState } from 'src/store';
import { EntityViewerGeneViewProteinsUI } from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsState';

export const updateGeneViewProteinsUIState = createAction(
  'entity-viewer/update-active-gene-view-proteins-ui-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneViewProteinsUI>;
}>();

export const toggleProteinInfo = (
  transcriptId: string
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
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
