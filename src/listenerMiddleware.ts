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
  type TypedStartListening,
  type ListenerEffectAPI
} from '@reduxjs/toolkit';

import { startVepListeners } from 'src/content/app/tools/vep/state/vep-action-listeners/vepActionListeners';

import type { AppDispatch, RootState } from './store';

const listenerMiddlewareInstance = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddlewareInstance.startListening as AppStartListening;

export type ListenerOptions = Parameters<AppStartListening>[0];
export type Effect = Parameters<AppStartListening>[0]['effect'];
export type ListenerApi = Parameters<ListenerOptions['effect']>[1];
export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>;

export const startListeners = () => {
  startVepListeners(startAppListening);
};

export default listenerMiddlewareInstance;
