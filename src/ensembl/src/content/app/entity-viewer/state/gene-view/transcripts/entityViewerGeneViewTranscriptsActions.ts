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

import {
  getGeneViewName,
  getViewTranscriptsContentUI
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';

import { View } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';
import { RootState } from 'src/store';
import { updateActiveGeneViewUIState } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';

export const toggleTranscriptInfo: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (transcriptId: string) => (dispatch, getState: () => RootState) => {
  const state = getState();

  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  const view = getGeneViewName(state);

  if (!activeGenomeId || !activeObjectId || !view) {
    return;
  }

  const expadndedTranscriptIds =
    getViewTranscriptsContentUI(state)?.expadndedTranscriptIds || [];

  const index = expadndedTranscriptIds.indexOf(transcriptId);

  if (index > -1) {
    expadndedTranscriptIds.splice(index, 1);
  } else {
    expadndedTranscriptIds.push(transcriptId);
  }

  dispatch(
    updateActiveGeneViewUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        contentUI: {
          [View.TRANSCRIPTS]: {
            expadndedTranscriptIds
          }
        }
      }
    })
  );
};

export const toggleTranscriptDownload: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (transcriptId: string) => (dispatch, getState: () => RootState) => {
  const state = getState();

  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  const view = getGeneViewName(state);

  if (!activeGenomeId || !activeObjectId || !view) {
    return;
  }

  const expandedTranscriptDownloads =
    getViewTranscriptsContentUI(state)?.expandedTranscriptDownloads || [];

  const index = expandedTranscriptDownloads.indexOf(transcriptId);

  if (index > -1) {
    expandedTranscriptDownloads.splice(index, 1);
  } else {
    expandedTranscriptDownloads.push(transcriptId);
  }

  dispatch(
    updateActiveGeneViewUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        contentUI: {
          [View.TRANSCRIPTS]: {
            expandedTranscriptDownloads
          }
        }
      }
    })
  );
};
