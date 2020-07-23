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

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { StateType } from 'typesafe-actions';
import { createEpicMiddleware } from 'redux-observable';

import config from 'config';

import createRootReducer from './root/rootReducer';
import { analyticsMiddleWare } from './analyticsMiddleware';
import rootEpic from './root/rootEpic';

export const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware();

const rootReducer = createRootReducer(history);

export type RootState = StateType<typeof rootReducer>;

const middleware = [
  ...getDefaultMiddleware(),
  routerMiddleware(history),
  epicMiddleware,
  analyticsMiddleWare
];

export default function getReduxStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware,
    devTools: config.isDevelopment
  });

  epicMiddleware.run(rootEpic as any);

  return store;
}
