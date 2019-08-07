import { createAction, createStandardAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';

import { RootState } from 'src/store';
import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject,
  getBrowserTrackStates
} from '../browserSelectors';
import { getBookmarks } from './trackPanelSelectors';

import { Bookmark } from './trackPanelState';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { getFormattedLocation } from 'src/shared/helpers/regionFormatter';

const buildBookmarkLabel = (ensObject: EnsObject): string => {
  if (ensObject.object_type === 'gene') {
    return `${ensObject.label} (${ensObject.stable_id})`;
  }

  return ensObject.stable_id
    ? ensObject.stable_id
    : `Region: ${getFormattedLocation(ensObject.location)}`;
};

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

export const updateBookmarks = createStandardAction(
  'track-panel/update-bookmarks'
)<{ [genomeId: string]: Bookmark[] }>();

export const updateBookmarksAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeEnsObject = getBrowserActiveEnsObject(state);
  if (!activeGenomeId || !activeEnsObject) {
    return;
  }
  const trackStates = getBrowserTrackStates(state)[activeGenomeId];

  const bookmarks = { ...getBookmarks(getState()) };

  const activeGenomeBookmarks = bookmarks[activeGenomeId]
    ? [...bookmarks[activeGenomeId]]
    : [];

  const existingIndex = activeGenomeBookmarks.findIndex(
    (bookmark) => bookmark.object_id === activeEnsObject.object_id
  );
  if (existingIndex !== -1 && activeGenomeBookmarks.length > 1) {
    // If it is already present, bump it to the end
    activeGenomeBookmarks.push(activeGenomeBookmarks[existingIndex]);
    activeGenomeBookmarks.splice(existingIndex, 1);
  } else if (existingIndex === -1) {
    // IF it is not present, add it to the end
    activeGenomeBookmarks.push({
      genome_id: activeEnsObject.genome_id,
      object_id: activeEnsObject.object_id,
      object_type: activeEnsObject.object_type,
      label: buildBookmarkLabel(activeEnsObject),
      location: { ...activeEnsObject.location },
      trackStates: { ...trackStates }
    });
  }

  bookmarks[activeGenomeId] = activeGenomeBookmarks;

  dispatch(updateBookmarks(bookmarks));
};
