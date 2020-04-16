import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type StableIdField = 'versioned_stable_id' | 'stable_id';
export const getDisplayStableId = (ensObject: Pick<EnsObject, StableIdField>) =>
  ensObject.versioned_stable_id || ensObject.stable_id || '';
