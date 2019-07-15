import { EnsObject } from './ensObjectTypes';

export type EnsObjectsState = Readonly<{
  [ensObjectId: string]: EnsObject;
}>;

export const defaultEnsObjectsState: EnsObjectsState = {};
