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

import { RefObject, ReactEventHandler } from 'react';

import * as headerActions from './header/headerActions';
import * as browserActions from './content/app/genome-browser/state/browserActions';
import * as customDownloadActions from './content/app/custom-download/state/customDownloadActions';
import * as trackPanelActions from './content/app/genome-browser/components/track-panel/state/trackPanelActions';

export type ReactRefs = {
  [key: string]: RefObject<HTMLElement>;
};

export type EventHandlers = {
  [key: string]: ReactEventHandler;
};

export type RootAction =
  | typeof headerActions
  | typeof browserActions
  | typeof customDownloadActions
  | typeof trackPanelActions;
