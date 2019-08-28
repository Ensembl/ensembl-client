import { LoadingState } from 'src/shared/types/loading-state';

export const shouldFetch = (status: LoadingState) =>
  ![LoadingState.LOADING, LoadingState.SUCCESS].includes(status);
