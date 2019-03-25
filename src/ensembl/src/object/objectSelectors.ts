import { RootState } from '../store';

export const getObjectFetchFailed = (state: RootState) =>
  state.object.objectInfo.objectFetchFailed;

export const getObjectFetching = (state: RootState) =>
  state.object.objectInfo.objectFetching;

export const getObjectInfo = (state: RootState) =>
  state.object.objectInfo.object;

export const getTrackCategories = (state: RootState): [] =>
  state.object.objectInfo.trackCategories;

export const getExampleObjectsFetchFailed = (state: RootState) =>
  state.object.exampleObjects.exampleObjectsFetchFailed;

export const getExampleObjectsFetching = (state: RootState) =>
  state.object.exampleObjects.exampleObjectsFetching;

export const getExampleObjects = (state: RootState) =>
  state.object.exampleObjects.examples;
