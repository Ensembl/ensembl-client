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

import { RootState } from '../store';
import { BreakpointWidth, ScrollPosition } from './globalConfig';

export const getBrowserTabId = (state: RootState) =>
  state.global.browserTabId || '';

export const getBreakpointWidth = (state: RootState): BreakpointWidth =>
  state.global.breakpointWidth;

export const getScrollPosition = (state: RootState): ScrollPosition =>
  state.global.scrollPosition;

export const getCurrentApp = (state: RootState): string =>
  state.global.currentApp;
