import { createAction, createStandardAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';

import { RootState } from 'src/store';
import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import { getBrowserActiveGenomeId } from '../browserSelectors';

export const toggleTrackPanel = createStandardAction(
  'track-panel/toggle-track-panel'
)<boolean | undefined>();

export const selectBrowserTab = createAction(
  'track-panel/select-browser-tab',
  (resolve) => {
    return (selectedBrowserTabForGenome: { [genomeId: string]: TrackType }) => {
      return resolve(selectedBrowserTabForGenome);
    };
  }
);

export const selectBrowserTabAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (selectedBrowserTab: TrackType) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  const selectedBrowserTabForGenome = {
    [activeGenomeId]: selectedBrowserTab
  };

  dispatch(selectBrowserTab(selectedBrowserTabForGenome));
  browserStorageService.updateSelectedBrowserTab(selectedBrowserTabForGenome);
};

export const openTrackPanelModal = createAction(
  'track-panel/open-track-panel-modal',
  (resolve) => {
    return (trackPanelModalView: string) => resolve(trackPanelModalView);
  }
);

export const closeTrackPanelModal = createStandardAction(
  'track-panel/close-track-panel-modal'
)();
