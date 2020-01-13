import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { batch } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';

import * as urlHelper from 'src/shared/helpers/urlHelper';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/entityViewerSelectors';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';

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
  if (params.genomeId !== getEntityViewerActiveGenomeId(state)) {
    dispatch(setDefaultActiveGenomeId());
    dispatch(fetchGenomeData(params.genomeId));
    // TODO: when backend is ready, entity info may also need fetching
  }
  // TODO: when backend is ready, fetch entity info
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
