import { getBrowserActiveGenomeInfo } from 'src/content/app/browser/browserSelectors';

import { RootState } from '../store';
import { EnsObject } from './ensObjectTypes';

export const getEnsObjectById = (
  state: RootState,
  objectId: string
): EnsObject | null => state.ensObjects[objectId] || null;

export const getExampleEnsObjects = (state: RootState): EnsObject[] => {
  const activeGenomeInfo = getBrowserActiveGenomeInfo(state);
  return activeGenomeInfo
    ? activeGenomeInfo.example_objects
        .map((id) => state.ensObjects[id])
        .filter(Boolean) // make sure there are no undefineds in the returned array
    : [];
};
