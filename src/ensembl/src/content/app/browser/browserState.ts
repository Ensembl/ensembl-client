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

import { OutgoingActionType } from 'ensembl-genome-browser';
import browserStorageService from './browser-storage-service';

import { BrowserTrackStates } from './track-panel/trackPanelConfig';

const isServer = typeof window === 'undefined';

const activeGenomeId = !isServer
  ? browserStorageService.getActiveGenomeId()
  : null;
const activeEnsObjectIds = !isServer
  ? browserStorageService.getActiveEnsObjectIds()
  : [];
const trackStates = !isServer ? browserStorageService.getTrackStates() : {};
const chrLocations = !isServer ? browserStorageService.getChrLocation() : [];

export enum BrowserNavAction {
  MOVE_UP = 'move_up',
  MOVE_DOWN = 'move_down',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out'
}

export const browserNavIconActionMap = {
  [BrowserNavAction.MOVE_UP]: OutgoingActionType.MOVE_UP,
  [BrowserNavAction.MOVE_DOWN]: OutgoingActionType.MOVE_DOWN,
  [BrowserNavAction.MOVE_LEFT]: OutgoingActionType.MOVE_LEFT,
  [BrowserNavAction.MOVE_RIGHT]: OutgoingActionType.MOVE_RIGHT,
  [BrowserNavAction.ZOOM_OUT]: OutgoingActionType.ZOOM_OUT,
  [BrowserNavAction.ZOOM_IN]: OutgoingActionType.ZOOM_IN
};

// states are top, right, bottom, left (TRBL) and minus (zoom out) and plus (zoom in)
export type BrowserNavIconStates = {
  [key in BrowserNavAction]: boolean;
};

export const defaultBrowserNavIconsState = {
  [BrowserNavAction.MOVE_UP]: false,
  [BrowserNavAction.MOVE_DOWN]: false,
  [BrowserNavAction.MOVE_LEFT]: false,
  [BrowserNavAction.MOVE_RIGHT]: false,
  [BrowserNavAction.ZOOM_OUT]: false,
  [BrowserNavAction.ZOOM_IN]: false
};

export type ChrLocation = [string, number, number];

export type ChrLocations = { [genomeId: string]: ChrLocation };

export type CogList = {
  [key: string]: number;
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
  applyToAllConfig: {
    isSelected: boolean;
    allTrackNamesOn: boolean;
    allTrackLabelsOn: boolean;
  };
  browserCogList: number;
  browserCogTrackList: CogList;
  selectedCog: string | null;
  trackConfigNames: { [key: string]: boolean };
  trackConfigLabel: { [key: string]: boolean };
}>;

export const defaultTrackConfigState: TrackConfigState = {
  applyToAllConfig: {
    isSelected: false,
    allTrackNamesOn: false,
    allTrackLabelsOn: true
  },
  browserCogList: 0,
  browserCogTrackList: {},
  selectedCog: null,
  trackConfigLabel: {},
  trackConfigNames: {}
};
