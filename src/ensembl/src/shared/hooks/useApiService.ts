import { useEffect, useReducer, Reducer } from 'react';

import apiService, { FetchOptions, APIError } from 'src/services/api-service';

import { LoadingState } from 'src/shared/types/loading-state';

type Params = FetchOptions & {
  endpoint: string;
  isAbortable?: boolean;
};

type StateAtLoading = {
  loadingState: LoadingState.LOADING;
  data: null;
  error: null;
};

type StateAtSuccess<T> = {
  loadingState: LoadingState.SUCCESS;
  data: T;
  error: null;
};

type StateAtError = {
  loadingState: LoadingState.ERROR;
  data: null;
  error: APIError;
};

type State<T> = StateAtLoading | StateAtSuccess<T> | StateAtError;

type LoadingAction = {
  type: 'loading';
};

type SuccessAction<T> = {
  type: 'success';
  payload: T;
};

type ErrorAction = {
  type: 'error';
  payload: APIError;
};

type Action<T> = LoadingAction | SuccessAction<T> | ErrorAction;

const initialState: StateAtLoading = {
  loadingState: LoadingState.LOADING,
  data: null,
  error: null
};

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'loading':
      return initialState;
    case 'success':
      return {
        loadingState: LoadingState.SUCCESS,
        data: action.payload,
        error: null
      };
    case 'error':
      return {
        loadingState: LoadingState.ERROR,
        data: null,
        error: action.payload
      };
    default:
      return state;
  }
};

const useApiService = <T>(params: Params): State<T> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
    reducer,
    initialState
  );

  useEffect(() => {
    let canUpdate = true;
    dispatch({ type: 'loading' });
    const { endpoint, isAbortable, ...fetchOptions } = params;
    const abortController = new AbortController();
    if (isAbortable) {
      fetchOptions.signal = abortController.signal;
    }

    apiService
      .fetch(endpoint, fetchOptions)
      .then((data) => {
        // notice that if the request has been aborted and the abort error caught in api service,
        // the promise will resolve with empty data; but, since canUpdate will be false,
        // the state will not get updated with empty data
        if (canUpdate) {
          dispatch({ type: 'success', payload: data });
        }
      })
      .catch((error) => {
        dispatch({ type: 'error', payload: error });
      });

    return () => {
      canUpdate = false;
      isAbortable && abortController.abort();
    };
  }, [params.endpoint, params.host]);

  return state;
};

export default useApiService;
