import { useEffect, useReducer, Reducer } from 'react';

import apiService, { FetchOptions } from 'src/services/api-service';

import { LoadingState } from 'src/shared/types/loading-state';

type Params = FetchOptions & {
  endpoint: string;
};

type StateAtLoading = {
  loadingState: LoadingState.LOADING;
  data: null;
};

type StateAtSuccess<T> = {
  loadingState: LoadingState.SUCCESS;
  data: T;
};

type State<T> = StateAtLoading | StateAtSuccess<T>;

type LoadingAction = {
  type: 'loading';
};

type SuccessAction<T> = {
  type: 'success';
  payload: T;
};

type Action<T> = LoadingAction | SuccessAction<T>;

const initialState: StateAtLoading = {
  loadingState: LoadingState.LOADING,
  data: null
};

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'loading':
      return initialState;
    case 'success':
      return {
        loadingState: LoadingState.SUCCESS,
        data: action.payload
      };
    default:
      return state;
  }
};

// TODO: might also think about request cancellation
const useApiService = <T>(params: Params): State<T> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
    reducer,
    initialState
  );

  useEffect(() => {
    let canUpdate = true;
    dispatch({ type: 'loading' });
    const { endpoint, ...fetchOptions } = params;

    apiService.fetch(endpoint, fetchOptions).then((data) => {
      if (canUpdate) {
        dispatch({ type: 'success', payload: data });
      }
    });

    return () => {
      canUpdate = false;
    };
  }, [params.endpoint, params.host]);

  // TODO: should also be able to signal error
  return state;
};

export default useApiService;
