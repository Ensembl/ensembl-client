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

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import createRootReducer from 'src/root/rootReducer';

// compared to the client-side store, the server-side store does not need
// the middleware for redux-observable
const middleware = [graphqlApiSlice.middleware, restApiSlice.middleware];

export const getServerSideReduxStore = () => {
  return configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware)
  });
};

export type ServerSideReduxStore = ReturnType<typeof getServerSideReduxStore>;
