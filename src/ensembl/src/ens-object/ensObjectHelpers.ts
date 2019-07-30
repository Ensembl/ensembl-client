import { EnsObject } from 'src/ens-object/ensObjectTypes';

export const getDisplayStableId = (ensObject: EnsObject) =>
  ensObject.versioned_stable_id || ensObject.stable_id || '';
