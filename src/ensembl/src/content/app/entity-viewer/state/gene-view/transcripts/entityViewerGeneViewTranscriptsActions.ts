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

import { getTranscriptsUI } from 'src/content/app/entity-viewer/state/gene-view/transcripts/entityViewerGeneViewTranscriptsSelectors';

import { RootState } from 'src/store';
import { EntityViewerGeneViewTranscriptsUI } from 'src/content/app/entity-viewer/state/gene-view/transcripts/entityViewerGeneViewTranscriptsState';

export const updateGeneViewTranscriptsUIState = createAction(
  'entity-viewer/update-active-gene-view-transcripts-ui-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneViewTranscriptsUI>;
}>();

export const toggleTranscriptInfo = (
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

  const expandedTranscriptIds =
    getTranscriptsUI(state)?.expandedTranscriptIds || [];

  const index = expandedTranscriptIds.indexOf(transcriptId);

  if (index > -1) {
    expandedTranscriptIds.splice(index, 1);
  } else {
    expandedTranscriptIds.push(transcriptId);
  }

  dispatch(
    updateGeneViewTranscriptsUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        expandedTranscriptIds
      }
    })
  );
};

export const toggleTranscriptDownload = (
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

  const expandedTranscriptDownloads =
    getTranscriptsUI(state)?.expandedTranscriptDownloads || [];

  const index = expandedTranscriptDownloads.indexOf(transcriptId);

  if (index > -1) {
    expandedTranscriptDownloads.splice(index, 1);
  } else {
    expandedTranscriptDownloads.push(transcriptId);
  }

  dispatch(
    updateGeneViewTranscriptsUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        expandedTranscriptDownloads
      }
    })
  );
};
