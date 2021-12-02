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

import { ActionType, getType } from 'typesafe-actions';

import * as ensObjectActions from './ensObjectActions';
import { EnsObjectsState, defaultEnsObjectsState } from './ensObjectState';

import { LoadingState } from 'src/shared/types/loading-state';
import { EnsObject } from './ensObjectTypes';

const buildLoadingObject = (id: string) => ({
  [id]: {
    loadingStatus: LoadingState.LOADING,
    data: null
  }
});

const buildLoadedObject = (payload: { id: string; data: EnsObject }) => ({
  [payload.id]: {
    data: payload.data,
    loadingStatus: LoadingState.SUCCESS
  }
});

export default function ensObjectsReducer(
  state: EnsObjectsState = defaultEnsObjectsState,
  action: ActionType<typeof ensObjectActions>
) {
  switch (action.type) {
    case getType(ensObjectActions.fetchEnsObjectAsyncActions.request):
      return {
        ...state,
        ...buildLoadingObject(action.payload)
      };

    case getType(ensObjectActions.fetchEnsObjectAsyncActions.success):
      return {
        ...state,
        ...buildLoadedObject(action.payload)
      };

    default:
      return state;
  }
}
