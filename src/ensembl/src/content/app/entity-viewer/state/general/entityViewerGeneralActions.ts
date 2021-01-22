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
import { batch } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';

import * as urlHelper from 'src/shared/helpers/urlHelper';
import {
  buildEnsObjectId,
  parseFocusIdFromUrl,
  buildFocusIdForUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';
import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityIds,
  getEntityViewerActiveEntityId
} from './entityViewerGeneralSelectors';
import { getGenomeInfoById } from 'src/shared/state/genome/genomeSelectors';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { ensureSpeciesIsEnabled } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';
import { RootState } from 'src/store';

export const setActiveGenomeId = createAction(
  'entity-viewer/set-active-genome-id'
)<string>();

export const setDataFromUrl: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (params: EntityViewerParams) => (dispatch, getState: () => RootState) => {
  const state = getState();
  const { genomeId: genomeIdFromUrl } = params;

  let activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeEntityId = getEntityViewerActiveEntityId(state) || undefined;

  const entityIdForUrl = activeEntityId
    ? buildFocusIdForUrl(activeEntityId)
    : undefined;

  if (!genomeIdFromUrl && !activeGenomeId) {
    dispatch(setDefaultActiveGenomeId());
    activeGenomeId = getEntityViewerActiveGenomeId(state) as string;
  } else if (!genomeIdFromUrl && activeGenomeId) {
    const newUrl = urlHelper.entityViewer({
      genomeId: activeGenomeId,
      entityId: entityIdForUrl
    });
    dispatch(replace(newUrl));
  } else if (genomeIdFromUrl && genomeIdFromUrl !== activeGenomeId) {
    dispatch(setActiveGenomeId(genomeIdFromUrl));
    dispatch(fetchGenomeData(genomeIdFromUrl));
    dispatch(ensureSpeciesIsEnabled(genomeIdFromUrl));

    // TODO: when backend is ready, entity info may also need fetching
  } else if (activeGenomeId) {
    // TODO: when backend is ready, fetch entity info
    const genomeInfo = getGenomeInfoById(state, activeGenomeId);
    if (!genomeInfo) {
      dispatch(fetchGenomeData(activeGenomeId));
    }
    dispatch(ensureSpeciesIsEnabled(activeGenomeId));
  }

  const entityId = params.entityId
    ? buildEnsObjectId({
        genomeId: genomeIdFromUrl as string,
        ...parseFocusIdFromUrl(params.entityId)
      })
    : null;

  if (entityId && genomeIdFromUrl) {
    if (entityId !== activeEntityId) {
      dispatch(updateEntityId(entityId));
    }

    entityViewerStorageService.updateGeneralState({
      activeGenomeId: genomeIdFromUrl
    });
    entityViewerStorageService.updateGeneralState({
      activeEntityIds: { [genomeIdFromUrl]: entityId }
    });
  }
};

export const setDefaultActiveGenomeId: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const [firstCommittedSpecies] = getCommittedSpecies(state);
  const activeGenomeId = firstCommittedSpecies.genome_id;
  const newUrl = urlHelper.entityViewer({ genomeId: activeGenomeId });
  batch(() => {
    dispatch(setActiveGenomeId(activeGenomeId));
    dispatch(replace(newUrl));
  });
};

export const changeActiveGenomeId: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (genomeId: string) => (dispatch) => {
  const newUrl = urlHelper.entityViewer({ genomeId });
  batch(() => {
    dispatch(setActiveGenomeId(genomeId));
    dispatch(push(newUrl));
  });
};

export const updateActiveEntityForGenome = createAction(
  'entity-viewer/update-active-entity-ids'
)<{ [objectId: string]: string }>();

export const updateEntityId: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (activeEntityId: string) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const currentActiveEntityIds = getEntityViewerActiveEntityIds(state);
    const updatedActiveEntityIds = {
      ...currentActiveEntityIds,
      [activeGenomeId]: activeEntityId
    };

    dispatch(updateActiveEntityForGenome(updatedActiveEntityIds));
  };
};
