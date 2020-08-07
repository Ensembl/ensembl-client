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
  CogList,
  BrowserNavStates,
  ChrLocation
} from 'src/content/app/browser/browserState';
import {
  AnchorCoordinates,
  ZmenuContentFeature
} from 'src/content/app/browser/zmenu/zmenu-types';

export enum BrowserToChromeMessagingActions {
  ZMENU_CREATE = 'create_zmenu',
  ZMENU_DESTROY = 'destroy_zmenu',
  ZMENU_REPOSITION = 'update_zmenu_position',
  UPDATE_LOCATION = 'update_location',
  UPDATE_SCROLL_POSITION = 'update_scroll_position',
  UPDATE_TRACK_POSITION = 'upadte_track_position',
  GENOME_BROWSER_READY = 'genome_browser_ready'
}

export type BrowserScrollPayload =
  | {
      delta_y: number;
      action: BrowserToChromeMessagingActions.UPDATE_SCROLL_POSITION;
    }
  | {
      action: BrowserToChromeMessagingActions.UPDATE_TRACK_POSITION;
      track_y: CogList;
    };

export type BrowserLocationUpdatePayload = {
  action: BrowserToChromeMessagingActions.UPDATE_LOCATION;
  bumper?: BrowserNavStates;
  'intended-location'?: ChrLocation;
  'actual-location'?: ChrLocation;
  'is-focus-position'?: boolean;
};

export type ZmenuCreatePayload = {
  action: BrowserToChromeMessagingActions.ZMENU_CREATE;
  id: string;
  anchor_coordinates: AnchorCoordinates;
  content: ZmenuContentFeature[];
};

export type ZmenuDestroyPayload = {
  id: string;
  action: BrowserToChromeMessagingActions.ZMENU_DESTROY;
};

export type ZmenuRepositionPayload = {
  id: string;
  action: BrowserToChromeMessagingActions.ZMENU_REPOSITION;
  anchor_coordinates: {
    x: number;
    y: number;
  };
};

export type ZmenuIncomingPayload =
  | ZmenuCreatePayload
  | ZmenuDestroyPayload
  | ZmenuRepositionPayload;
