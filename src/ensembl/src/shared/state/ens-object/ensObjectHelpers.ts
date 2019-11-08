import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

export const getDisplayStableId = (ensObject: EnsObject) =>
  ensObject.versioned_stable_id || ensObject.stable_id || '';
