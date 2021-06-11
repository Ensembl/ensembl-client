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

import { ChrLocation } from 'src/content/app/browser/browserState';
import {
  AnchorCoordinates,
  ZmenuContentFeature
} from 'src/content/app/browser/zmenu/zmenu-types';

export enum OutgoingActionType {
  PING = 'ping',
  ACTIVATE_BROWSER = 'activate_browser',
  MOVE_DOWN = 'move_down',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  MOVE_UP = 'move_up',
  SET_FOCUS = 'set_focus',
  SET_FOCUS_LOCATION = 'set_focus_location',
  TOGGLE_TRACKS = 'toggle_tracks',
  TURN_ON_TRACKS = 'turn_on_tracks',
  TURN_OFF_TRACKS = 'turn_off_tracks',
  TURN_ON_LABELS = 'turn_on_labels',
  TURN_OFF_LABELS = 'turn_off_labels',
  ZMENU_ACTIVITY_OUTSIDE = 'zmenu-activity-outside', // TODO: sometime later, unify underscores vs hyphens (together with Genome Browser)
  ZMENU_ENTER = 'zmenu-enter',
  ZMENU_LEAVE = 'zmenu-leave',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out'
}

export enum IncomingActionType {
  GENOME_BROWSER_READY = 'genome_browser_ready',
  UPDATE_LOCATION = 'update_location',
  UPDATE_SCROLL_POSITION = 'update_scroll_position',
  UPDATE_TRACK_POSITION = 'upadte_track_position',
  ZMENU_CREATE = 'create_zmenu',
  ZMENU_DESTROY = 'destroy_zmenu',
  ZMENU_REPOSITION = 'update_zmenu_position'
}

export type CogScrollPayload = {
  delta_y: number;
};

export type CogList = {
  [key: string]: number;
};

export type CogTrackScrollPayload = {
  track_y: CogList;
};

// states are top, right, bottom, left (TRBL) and minus (zoom out) and plus (zoom in)
export type BrowserNavStates = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
];

export type GenomeBrowserReadyAction = {
  type: IncomingActionType.GENOME_BROWSER_READY;
  payload: never;
};

export type BrowserLocationUpdateAction = {
  type: IncomingActionType.UPDATE_LOCATION;
  payload: {
    bumper?: BrowserNavStates;
    'intended-location'?: ChrLocation;
    'actual-location'?: ChrLocation;
    'is-focus-position'?: boolean;
  };
};

export type UpdateCogPositionAction = {
  type: IncomingActionType.UPDATE_SCROLL_POSITION;
  payload: CogScrollPayload;
};

export type UpdateCogTrackPositionAction = {
  type: IncomingActionType.UPDATE_TRACK_POSITION;
  payload: CogTrackScrollPayload;
};

export type ZmenuCreateAction = {
  type: IncomingActionType.ZMENU_CREATE;
  payload: {
    id: string;
    anchor_coordinates: AnchorCoordinates;
    content: ZmenuContentFeature[];
  };
};

export type ZmenuDestroyAction = {
  type: IncomingActionType.ZMENU_DESTROY;
  payload: { id: string };
};

export type ZmenuRepositionAction = {
  type: IncomingActionType.ZMENU_REPOSITION;
  payload: {
    id: string;
    anchor_coordinates: {
      x: number;
      y: number;
    };
  };
};

export type BrowserToggleTracksAction = {
  type: OutgoingActionType.TOGGLE_TRACKS;
  payload: {
    on?: string | string[];
    off?: string | string[];
  };
};

export type TurnOnTracksAction = {
  type: OutgoingActionType.TURN_ON_TRACKS;
  payload: {
    track_ids: string[];
  };
};

export type TurnOffTracksAction = {
  type: OutgoingActionType.TURN_OFF_TRACKS;
  payload: {
    track_ids: string[];
  };
};

export type TurnOnLabelsAction = {
  type: OutgoingActionType.TURN_ON_LABELS;
  payload: {
    track_ids: string[];
  };
};

export type TurnOffLabelsAction = {
  type: OutgoingActionType.TURN_OFF_LABELS;
  payload: {
    track_ids: string[];
  };
};

export type BrowserSetFocusAction = {
  type: OutgoingActionType.SET_FOCUS;
  payload: {
    focus?: string | undefined;
  };
};

export type BrowserSetFocusLocationAction = {
  type: OutgoingActionType.SET_FOCUS_LOCATION;
  payload: {
    endBp: number;
    startBp: number;
    // stick: string;
    // goto: string;
    // focus?: string | undefined;
  };
};

export type ActivateBrowserAction = {
  type: OutgoingActionType.ACTIVATE_BROWSER;
};

export type ZmenuEnterAction = {
  type: OutgoingActionType.ZMENU_ENTER;
  payload: {
    id: string;
  };
};

export type ZmenuOutsideActivityAction = {
  type: OutgoingActionType.ZMENU_ACTIVITY_OUTSIDE;
  payload: {
    id: string;
  };
};

export type ZmenuLeaveAction = {
  type: OutgoingActionType.ZMENU_LEAVE;
  payload: {
    id: string;
  };
};

export type MoveUpAction = {
  type: OutgoingActionType.MOVE_UP;
  payload: { move_up_px: number };
};

export type MoveDownAction = {
  type: OutgoingActionType.MOVE_DOWN;
  payload: { move_down_px: number };
};

export type MoveLeftAction = {
  type: OutgoingActionType.MOVE_LEFT;
  payload: { move_left_px: number };
};

export type MoveRightAction = {
  type: OutgoingActionType.MOVE_RIGHT;
  payload: { move_right_px: number };
};

export type ZoomInAction = {
  type: OutgoingActionType.ZOOM_IN;
  payload: { zoom_by: number };
};

export type ZoomOutAction = {
  type: OutgoingActionType.ZOOM_OUT;
  payload: { zoom_by: number };
};

export type PingAction = {
  type: OutgoingActionType.PING;
};

export type OutgoingAction =
  | PingAction
  | ActivateBrowserAction
  | BrowserToggleTracksAction
  | TurnOnTracksAction
  | TurnOffTracksAction
  | TurnOnLabelsAction
  | TurnOffLabelsAction
  | ZmenuEnterAction
  | ZmenuLeaveAction
  | ZmenuOutsideActivityAction
  | BrowserSetFocusLocationAction
  | BrowserSetFocusAction
  | MoveUpAction
  | MoveDownAction
  | MoveLeftAction
  | MoveRightAction
  | ZoomInAction
  | ZoomOutAction;

export type IncomingAction =
  | GenomeBrowserReadyAction
  | BrowserLocationUpdateAction
  | UpdateCogPositionAction
  | UpdateCogTrackPositionAction
  | ZmenuCreateAction
  | ZmenuDestroyAction
  | ZmenuRepositionAction;

export const createOutgoingAction = (action: OutgoingAction) => {
  return { ...action };
};
