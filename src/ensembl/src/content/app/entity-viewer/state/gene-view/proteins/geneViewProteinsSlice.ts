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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getExpandedTranscriptIds } from './geneViewProteinsSelectors';

import { RootState } from 'src/store';

export type ProteinsStatePerGene = {
  expandedTranscriptIds: string[];
};

export type GeneViewProteinsState = {
  [genomeId: string]: {
    [geneId: string]: ProteinsStatePerGene;
  };
};

const defaultStatePerGene: ProteinsStatePerGene = {
  expandedTranscriptIds: []
};

export const toggleExpandedProtein = (
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

  const expandedIds = new Set<string>(getExpandedTranscriptIds(state));
  if (expandedIds.has(transcriptId)) {
    expandedIds.delete(transcriptId);
  } else {
    expandedIds.add(transcriptId);
  }

  dispatch(
    proteinsSlice.actions.updateExpandedProteins({
      activeGenomeId,
      activeObjectId,
      expandedIds: [...expandedIds.values()]
    })
  );
};

type ExpandedProteinsPayload = {
  activeGenomeId: string;
  activeObjectId: string;
  expandedIds: string[];
};

const proteinsSlice = createSlice({
  name: 'entity-viewer-gene-view-proteins',
  initialState: {} as GeneViewProteinsState,
  reducers: {
    updateExpandedProteins(
      state,
      action: PayloadAction<ExpandedProteinsPayload>
    ) {
      const { activeGenomeId, activeObjectId, expandedIds } = action.payload;
      if (!state[activeGenomeId]) {
        state[activeGenomeId] = { [activeObjectId]: defaultStatePerGene };
      }
      state[activeGenomeId][activeObjectId].expandedTranscriptIds = expandedIds;
    }
  }
});

export default proteinsSlice.reducer;
