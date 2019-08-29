import get from 'lodash/get';

import { getBrowserActiveGenomeInfo } from 'src/content/app/browser/browserSelectors';

import { LoadingState } from 'src/shared/types/loading-state';
import { RootState } from '../store';
import { EnsObject } from './ensObjectTypes';

export const getEnsObjectLoadingStatus = (
  state: RootState,
  objectId: string
): LoadingState =>
  get(
    state,
    `ensObjects.${objectId}.loadingStatus`,
    LoadingState.NOT_REQUESTED
  );

export const getEnsObjectById = (
  state: RootState,
  objectId: string
): EnsObject | null => {
  return get(state, `ensObjects.${objectId}.data`, null);
};

export const getExampleEnsObjects = (state: RootState): EnsObject[] => {
  const activeGenomeInfo = getBrowserActiveGenomeInfo(state);
  return activeGenomeInfo
    ? (activeGenomeInfo.example_objects
        .map((id) => state.ensObjects[id] && state.ensObjects[id].data)
        .filter(Boolean) as EnsObject[]) // make sure there are no undefineds in the returned array
    : [];
};
