import { getBrowserActiveGenomeInfo } from 'src/content/app/browser/browserSelectors';

import { RootState } from '../store';
import { EnsObject, EnsObjectTrack } from './ensObjectTypes';

export const getEnsObjectInfo = (state: RootState) =>
  state.ensObject.ensObjectInfo.ensObjectInfoData as EnsObject;

export const getEnsObjectTracksFetchFailed = (state: RootState) =>
  state.ensObject.ensObjectTracks.ensObjectTracksFetchFailed;

export const getEnsObjectTracksFetching = (state: RootState) =>
  state.ensObject.ensObjectTracks.ensObjectTracksFetching;

export const getEnsObjectTracks = (state: RootState) =>
  state.ensObject.ensObjectTracks.ensObjectTracksData as EnsObjectTrack;

export const getExampleEnsObjects = (state: RootState): EnsObject[] => {
  const activeGenomeInfo = getBrowserActiveGenomeInfo(state);
  return activeGenomeInfo
    ? activeGenomeInfo.example_objects
        .map((id) => state.ensObjects[id])
        .filter(Boolean)
    : []; // make sure there are no undefineds in the returned array
};
