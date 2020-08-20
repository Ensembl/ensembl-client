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

export enum ChromeToBrowserMessagingActions {
  TOGGLE_TRACKS = 'toggle_tracks',
  SET_FOCUS_LOCATION = 'set_focus_location',
  SET_FOCUS = 'set_focus',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  MOVE_DOWN = 'move_down',
  MOVE_UP = 'move_up',
  ZOOM_BY = 'zoom_by',
  ZMENU_ENTER = 'zmenu-enter',
  ZMENU_LEAVE = 'zmenu-leave',
  ZMENU_ACTIVITY_OUTSIDE = 'zmenu-activity-outside' // TODO: sometime later, unify underscores vs hyphens (together with Genome Browser)
}

export type BrowserToggleTracksPayload = {
  on?: string | string[];
  off?: string | string[];
};

export type BrowserSetFocusPayload = {
  focus?: string | undefined;
};

export type BrowserSetFocusLocationPayload = {
  stick: string;
  goto: string;
  focus?: string | undefined;
};

export type ActivateBrowserPayload = {
  'config-url': string;
  key: string;
  selector: string;
};

export type ZmenuEnterPayload = {
  id: string;
};

export type ZmenuOutsideActivityPayload = {
  id: string;
};

export type ZmenuLeavePayload = {
  id: string;
};

export type OutgoingMessage =
  | {
      action: ChromeToBrowserMessagingActions.TOGGLE_TRACKS;
      payload: BrowserToggleTracksPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.ZMENU_ENTER;
      payload: ZmenuEnterPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.ZMENU_LEAVE;
      payload: ZmenuLeavePayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.ZMENU_ACTIVITY_OUTSIDE;
      payload: ZmenuOutsideActivityPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.SET_FOCUS_LOCATION;
      payload: BrowserSetFocusLocationPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.SET_FOCUS;
      payload: BrowserSetFocusPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.MOVE_UP;
      payload: { move_up_px: number };
    }
  | {
      action: ChromeToBrowserMessagingActions.MOVE_DOWN;
      payload: { move_down_px: number };
    }
  | {
      action: ChromeToBrowserMessagingActions.MOVE_LEFT;
      payload: { move_left_px: number };
    }
  | {
      action: ChromeToBrowserMessagingActions.MOVE_RIGHT;
      payload: { move_right_px: number };
    }
  | {
      action: ChromeToBrowserMessagingActions.ZOOM_BY;
      payload: { zoom_by: number };
    };

export const toggleTracksMessage = (
  payload: BrowserToggleTracksPayload
): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.TOGGLE_TRACKS,
    payload
  };
};

export const zmenuEnterMessage = (
  payload: ZmenuEnterPayload
): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.ZMENU_ENTER,
    payload
  };
};

export const zmenuLeaveMessage = (
  payload: ZmenuLeavePayload
): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.ZMENU_LEAVE,
    payload
  };
};

export const zmenuActivityOutsideMessage = (
  payload: ZmenuOutsideActivityPayload
): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.ZMENU_ACTIVITY_OUTSIDE,
    payload
  };
};

export const setFocusLocationMessage = (
  payload: BrowserSetFocusLocationPayload
): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.SET_FOCUS_LOCATION,
    payload
  };
};

export const setFocusMessage = (
  payload: BrowserSetFocusPayload
): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.SET_FOCUS,
    payload
  };
};

export const browserZoomByMessage = (payload: {
  zoom_by: number;
}): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.ZOOM_BY,
    payload
  };
};

export const browserMoveUpMessage = (payload: {
  move_up_px: number;
}): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.MOVE_UP,
    payload
  };
};

export const browserMoveDownMessage = (payload: {
  move_down_px: number;
}): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.MOVE_DOWN,
    payload
  };
};

export const browserMoveLeftMessage = (payload: {
  move_left_px: number;
}): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.MOVE_LEFT,
    payload
  };
};

export const browserMoveRightMessage = (payload: {
  move_right_px: number;
}): OutgoingMessage => {
  return {
    action: ChromeToBrowserMessagingActions.MOVE_RIGHT,
    payload
  };
};
