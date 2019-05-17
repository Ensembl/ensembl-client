import { RootState } from '../store';
import { EnsObjectInfo } from './ensObjectTypes';
import { TrackPanelCategory } from 'src/content/app/browser/track-panel/trackPanelConfig';

export const getEnsObjectFetchFailed = (state: RootState) =>
  state.ensObject.currentEnsObject.ensObjectFetchFailed;

export const getEnsObjectFetching = (state: RootState) =>
  state.ensObject.currentEnsObject.ensObjectFetching;

export const getEnsObjectInfo = (state: RootState): EnsObjectInfo =>
  state.ensObject.currentEnsObject.ensObjectInfo as EnsObjectInfo;

export const getTrackCategories = (state: RootState): TrackPanelCategory[] =>
  state.ensObject.currentEnsObject.trackCategories as TrackPanelCategory[];

export const getExampleEnsObjectsFetchFailed = (state: RootState) =>
  state.ensObject.exampleEnsObjects.exampleEnsObjectsFetchFailed;

export const getExampleEnsObjectsFetching = (state: RootState) =>
  state.ensObject.exampleEnsObjects.exampleEnsObjectsFetching;

export const getExampleEnsObjects = (state: RootState) =>
  state.ensObject.exampleEnsObjects.examples;
