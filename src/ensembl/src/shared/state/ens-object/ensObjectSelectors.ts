import get from 'lodash/get';

import { getGenomeInfoById } from 'src/shared/state/genome/genomeSelectors';

import { LoadingState } from 'src/shared/types/loading-state';
import { RootState } from '../../../store';
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

export const getExampleEnsObjects = (
  state: RootState,
  genomeId: string
): EnsObject[] => {
  const genomeInfo = getGenomeInfoById(state, genomeId);
  const exampleObjects = genomeInfo?.example_objects || [];
  return exampleObjects
    .map((id) => state.ensObjects[id] && state.ensObjects[id].data)
    .filter(Boolean) as EnsObject[]; // make sure there are no undefineds in the returned array;
};

export const getExampleGenes = (
  genomeId: string,
  state: RootState
): EnsObject[] => {
  const genomeInfo = getGenomeInfoById(state, genomeId);
  const exampleObjectIds = genomeInfo?.example_objects || [];
  return exampleObjectIds
    .map((id) => getEnsObjectById(state, id))
    .filter((item): item is EnsObject => item !== null)
    .filter((entity) => entity.object_type === 'gene');
};
