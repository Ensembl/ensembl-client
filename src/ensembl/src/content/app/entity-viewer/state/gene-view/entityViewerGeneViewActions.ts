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

import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { EntityViewerGeneViewUIState } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';
import { RootState } from 'src/store';

export const updateActiveGeneViewUIState = createAction(
  'entity-viewer/update-active-gene-view-object-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneViewUIState>;
}>();

export const setGeneViewName: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (view: string | null) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());
  if (!activeGenomeId || !activeObjectId) {
    return;
  }
  dispatch(
    updateActiveGeneViewUIState({
      activeGenomeId,
      activeObjectId,
      fragment: { view }
    })
  );
};
