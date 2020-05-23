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

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { StateType } from 'typesafe-actions';
import { createEpicMiddleware } from 'redux-observable';

import createRootReducer from './root/rootReducer';
import { analyticsMiddleWare } from './analyticsMiddleware';
import rootEpic from './root/rootEpic';

export const history = createBrowserHistory();

const composeEnhancers = composeWithDevTools({});
const epicMiddleware = createEpicMiddleware();

const rootReducer = createRootReducer(history);

export type RootState = StateType<typeof rootReducer>;

export default function configureStore(preloadedState?: any) {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk,
        epicMiddleware,
        analyticsMiddleWare
      )
    )
  );

  epicMiddleware.run(rootEpic as any);

  return store;
}
