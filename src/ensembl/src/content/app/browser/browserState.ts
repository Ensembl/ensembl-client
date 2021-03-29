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

import browserStorageService from './browser-storage-service';

import { BrowserTrackStates } from './track-panel/trackPanelConfig';

const activeGenomeId = browserStorageService.getActiveGenomeId();
const activeEnsObjectIds = browserStorageService.getActiveEnsObjectIds();
const trackStates = browserStorageService.getTrackStates();
const chrLocations = browserStorageService.getChrLocation();

export enum BrowserNavAction {
  NAVIGATE_UP = 'navigate-up',
  NAVIGATE_RIGHT = 'navigate-right',
  NAVIGATE_DOWN = 'navigate-down',
  NAVIGATE_LEFT = 'navigate-left',
  ZOOM_OUT = 'zoom-out',
  ZOOM_IN = 'zoom-in'
}

// states are top, right, bottom, left (TRBL) and minus (zoom out) and plus (zoom in)
export type BrowserNavIconStates = {
  [key in BrowserNavAction]: boolean;
};

export const defaultBrowserNavIconsState = {
  [BrowserNavAction.NAVIGATE_UP]: false,
  [BrowserNavAction.NAVIGATE_RIGHT]: false,
  [BrowserNavAction.NAVIGATE_DOWN]: false,
  [BrowserNavAction.NAVIGATE_LEFT]: false,
  [BrowserNavAction.ZOOM_OUT]: false,
  [BrowserNavAction.ZOOM_IN]: false
};

export type ChrLocation = [string, number, number];

export type ChrLocations = { [genomeId: string]: ChrLocation };

export type CogList = {
  [key: string]: number;
};

export type BrowserState = Readonly<{
  browserActivated: boolean;
}>;

export const defaultBrowserState: BrowserState = {
  browserActivated: false
};

export type BrowserEntityState = Readonly<{
  activeGenomeId: string | null;
  activeEnsObjectIds: { [genomeId: string]: string };
  trackStates: BrowserTrackStates;
}>;

export const defaultBrowserEntityState: BrowserEntityState = {
  activeGenomeId,
  activeEnsObjectIds,
  trackStates
};

export type BrowserNavState = Readonly<{
  browserNavOpenState: { [genomeId: string]: boolean };
  browserNavIconStates: BrowserNavIconStates;
}>;

export const defaultBrowserNavState = {
  browserNavOpenState: {},
  browserNavIconStates: defaultBrowserNavIconsState
};

export type BrowserLocationState = Readonly<{
  chrLocations: ChrLocations; // final location of the browser when user stopped dragging/zooming; used to update the url
  actualChrLocations: ChrLocations; // transient locations that change while user is dragging or zooming
  regionEditorActive: boolean;
  regionFieldActive: boolean;
  isObjectInDefaultPosition: boolean;
}>;

export const defaultBrowserLocationState: BrowserLocationState = {
  chrLocations,
  actualChrLocations: {},
  regionEditorActive: false,
  regionFieldActive: false,
  isObjectInDefaultPosition: false
};

export type TrackConfigState = Readonly<{
  applyToAll: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  selectedCog: string | null;
  trackConfigNames: { [key: string]: boolean };
  trackConfigLabel: { [key: string]: boolean };
}>;

export const defaultTrackConfigState: TrackConfigState = {
  applyToAll: false,
  browserCogList: 0,
  browserCogTrackList: {},
  selectedCog: null,
  trackConfigLabel: {},
  trackConfigNames: {}
};
