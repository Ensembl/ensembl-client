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
import merge from 'lodash/merge';
import get from 'lodash/get';

import {
  defaultEntityViewerGeneViewUIState,
  initialEntityViewerGeneViewState,
  EntityViewerGeneViewState
} from './entityViewerGeneViewState';
import * as actions from './entityViewerGeneViewActions';
import proteinsReducer from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsReducer';
import transcriptsReducer from 'src/content/app/entity-viewer/state/gene-view/transcripts/entityViewerGeneViewTranscriptsReducer';
import * as proteinsActions from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsActions';
import * as transcriptsActions from 'src/content/app/entity-viewer/state/gene-view/transcripts/entityViewerGeneViewTranscriptsActions';

export function entityViewerGeneViewReducer(
  state: EntityViewerGeneViewState = initialEntityViewerGeneViewState,
  action: ActionType<
    typeof actions | typeof proteinsActions | typeof transcriptsActions
  >
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewUIState):
      const { activeGenomeId, activeObjectId, fragment } = action.payload;
      const oldStateFragment = get(
        state,
        `${activeGenomeId}.${activeObjectId}`,
        defaultEntityViewerGeneViewUIState
      );
      const updatedStateFragment = merge({}, oldStateFragment, fragment);
      return {
        ...state,
        [activeGenomeId]: {
          ...state[activeGenomeId],
          [activeObjectId]: updatedStateFragment
        }
      };
    case getType(proteinsActions.updateGeneViewProteinsUIState):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          [action.payload.activeObjectId]: {
            ...state[action.payload.activeGenomeId][
              action.payload.activeObjectId
            ],
            contentUI: {
              ...state[action.payload.activeGenomeId][
                action.payload.activeObjectId
              ].contentUI,
              protein: proteinsReducer(state, action)
            }
          }
        }
      };
    case getType(transcriptsActions.updateGeneViewTranscriptsUIState):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          [action.payload.activeObjectId]: {
            ...state[action.payload.activeGenomeId][
              action.payload.activeObjectId
            ],
            contentUI: {
              ...state[action.payload.activeGenomeId][
                action.payload.activeObjectId
              ].contentUI,
              transcripts: transcriptsReducer(state, action)
            }
          }
        }
      };
    default:
      return state;
  }
}

export default entityViewerGeneViewReducer;
