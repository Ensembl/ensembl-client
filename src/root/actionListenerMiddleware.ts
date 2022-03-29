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
  createListenerMiddleware,
  addListener,
  type TypedStartListening,
  type TypedAddListener
} from '@reduxjs/toolkit';

import {
  submitBlastListener,
  resforeBlastSubmissionsListener
} from 'src/content/app/tools/blast/state/action-listeners/blastActionListeners';

import type { RootState, AppDispatch } from '../store';

const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type Effect = Parameters<AppStartListening>[0]['effect'];

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

startAppListening(submitBlastListener);
startAppListening(resforeBlastSubmissionsListener);

export default listenerMiddleware;
