/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useReducer, type Reducer } from 'react';

import apiService, {
  type FetchOptions,
  type APIError
} from 'src/services/api-service';

import { LoadingState } from 'src/shared/types/loading-state';

type Params = FetchOptions & {
  endpoint: string;
  isAbortable?: boolean;
  skip?: boolean;
};

type StateBeforeRequest = {
  loadingState: LoadingState.NOT_REQUESTED;
  data: null;
  error: null;
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

type State<T> =
  | StateBeforeRequest
  | StateAtLoading
  | StateAtSuccess<T>
  | StateAtError;

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

const initialState: StateBeforeRequest = {
  loadingState: LoadingState.NOT_REQUESTED,
  data: null,
  error: null
};

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'loading':
      return {
        ...initialState,
        loadingState: LoadingState.LOADING
      };
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
    if (params.skip) {
      return;
    }
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
  }, [params.endpoint, params.host, params.skip]);

  return state;
};

export default useApiService;
