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

 import {OutgoingActionType, IncomingActionType} from 'src/content/app/browser/browser-messaging-service';

// relation of the point of interest to the central point of the canvas;
// a gentle hint by genome browser about where there is the most available space
// e.g. if the reported side of a point is 'left', zmenu will position itself
// to the right of this point
// TODO: check if this type is required
export enum Side {
  LEFT = 'left',
  RIGHT = 'right',
  MIDDLE = 'middle'
}

// coordinates of the point at which zmenu should be pointing
export type AnchorCoordinates = {
  x: number;
  y: number;
};

export enum Markup {
  STRONG = 'strong',
  EMPHASIS = 'emphasis',
  FOCUS = 'focus',
  LIGHT = 'light'
}

export type ZmenuContentItem = {
  text: string;
  markup: Markup[];
};

export type ZmenuContentBlock = ZmenuContentItem[];

export type ZmenuContentLine = ZmenuContentBlock[];

export type ZmenuContentFeature = {
  id: string;
  track_id: string;
  lines: ZmenuContentLine[];
};

// data that is sufficient to describe an instance of Zmenu
export type ZmenuData = {
  id: string;
  anchor_coordinates: AnchorCoordinates;
  content: ZmenuContentFeature[];
};

// Sent from Genome browser to React
export type ZmenuCreatePayload = {
  action: IncomingActionType.ZMENU_CREATE;
  id: string;
  anchor_coordinates: AnchorCoordinates;
  content: ZmenuContentFeature[];
};

// Sent from Genome browser to React
export type ZmenuDestroyPayload = {
  id: string;
  action: IncomingActionType.ZMENU_DESTROY;
};

// Sent from React to Genome browser
// (on mouseover; perhaps tap?)
export type ZmenuEnterPayload = {
  id: string;
  action: OutgoingActionType.ZMENU_ENTER;
};

// Sent from React to Genome browser
// (on mouseleave, or on click outside)
export type ZmenuOutsideActivityPayload = {
  id: string;
  action: OutgoingActionType.ZMENU_ACTIVITY_OUTSIDE;
};

// Sent from React to Genome browser
// (on mouseleave, or on click outside)
export type ZmenuLeavePayload = {
  id: string;
  action: OutgoingActionType.ZMENU_LEAVE;
};

// Sent from Genome browser to React
export type ZmenuRepositionPayload = {
  id: string;
  action: IncomingActionType.ZMENU_REPOSITION;
  anchor_coordinates: {
    x: number;
    y: number;
  };
};

export type ZmenuIncomingPayload =
  | ZmenuCreatePayload
  | ZmenuDestroyPayload
  | ZmenuRepositionPayload;
