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

import {
  configureStore,
  createAsyncThunk,
  type Action
} from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook
} from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';

import config from 'config';

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import createRootReducer from './root/rootReducer';
import rootEpic from './root/rootEpic';

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

const rootReducer = createRootReducer();

const middleware = [
  epicMiddleware,
  graphqlApiSlice.middleware,
  restApiSlice.middleware
];

const preloadedState = (globalThis as any).__PRELOADED_STATE__ || {};

export default function getReduxStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
    devTools: config.isDevelopment,
    preloadedState
  });

  epicMiddleware.run(rootEpic);

  return store;
}

type AppStore = ReturnType<typeof getReduxStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();
export type ThunkApi = Parameters<Parameters<typeof createAppAsyncThunk>[1]>[1];
