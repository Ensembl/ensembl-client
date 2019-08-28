import { LoadingState } from 'src/shared/types/loading-state';
import { EnsObject } from './ensObjectTypes';

export type EnsObjectsState = Readonly<{
  [ensObjectId: string]: {
    loadingStatus: LoadingState;
    data: EnsObject | null;
  };
}>;

export const defaultEnsObjectsState: EnsObjectsState = {};
