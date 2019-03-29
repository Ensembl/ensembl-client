import { RootState } from '../store';

export const getEnsObjectFetchFailed = (state: RootState) =>
  state.ensObject.ensObjectInfo.ensObjectFetchFailed;

export const getEnsObjectFetching = (state: RootState) =>
  state.ensObject.ensObjectInfo.ensObjectFetching;

export const getEnsObjectInfo = (state: RootState) =>
  state.ensObject.ensObjectInfo.ensObject;

export const getTrackCategories = (state: RootState): [] =>
  state.ensObject.ensObjectInfo.trackCategories;

export const getExampleEnsObjectsFetchFailed = (state: RootState) =>
  state.ensObject.exampleEnsObjects.exampleEnsObjectsFetchFailed;

export const getExampleEnsObjectsFetching = (state: RootState) =>
  state.ensObject.exampleEnsObjects.exampleEnsObjectsFetching;

export const getExampleEnsObjects = (state: RootState) =>
  state.ensObject.exampleEnsObjects.examples;
