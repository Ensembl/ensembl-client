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

import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook
} from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';

import config from 'config';

import listenerMiddleware from 'src/root/actionListenerMiddleware';

import thoasApiSlice from 'src/shared/state/api-slices/thoasSlice';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import createRootReducer from './root/rootReducer';
import rootEpic from './root/rootEpic';

const epicMiddleware = createEpicMiddleware();

const rootReducer = createRootReducer();

const middleware = [
  epicMiddleware,
  thoasApiSlice.middleware,
  restApiSlice.middleware
];

const preloadedState = (globalThis as any).__PRELOADED_STATE__ || {};

export default function getReduxStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(middleware),
    devTools: config.isDevelopment,
    preloadedState
  });

  epicMiddleware.run(rootEpic as any);

  return store;
}

type AppStore = ReturnType<typeof getReduxStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
