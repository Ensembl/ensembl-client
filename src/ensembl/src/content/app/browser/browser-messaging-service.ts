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

import windowService, {
  WindowServiceInterface
} from 'src/services/window-service';

import {
  ZmenuLeavePayload,
  ZmenuOutsideActivityPayload,
  ZmenuEnterPayload
} from 'src/content/app/browser/zmenu/zmenu-types';
import {
  ActivateBrowserPayload,
  BrowserSetFocusLoationPayload,
  BrowserSetFocusPayload
} from 'src/content/app/browser/browserActions';

/*
  This is a service for communicating between genome browser and React wrapper.
*/

export enum BrowserToChromeMessagingActions {
  ZMENU_CREATE = 'create_zmenu',
  ZMENU_DESTROY = 'destroy_zmenu',
  ZMENU_REPOSITION = 'update_zmenu_position'
}

export enum ChromeToBrowserMessagingActions {
  ACTIVATE_BROWSER = 'activate_browser',
  TOGGLE_TRACKS = 'toggle_tracks',
  SET_FOCUS_LOCATION = 'set_focus_location',
  SET_FOCUS = 'set_focus',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  MOVE_DOWN = 'move_down',
  MOVE_UP = 'move_up',
  ZOOM_BY = 'zoom_by',
  PING = 'ping',
  ZMENU_ENTER = 'zmenu-enter',
  ZMENU_LEAVE = 'zmenu-leave',
  ZMENU_ACTIVITY_OUTSIDE = 'zmenu-activity-outside' // TODO: sometime later, unify underscores vs hyphens (together with Genome Browser)
}

export enum BrowserMessagingType {
  BPANE_READY_QUERY = 'bpane-ready-query',
  BPANE_ACTIVATE = 'bpane-activate',
  BPANE = 'bpane'
}

export type BrowserToggleTracksPayload = {
  on?: string | string[];
  off?: string | string[];
};

export type OutgoingPayload =
  | {
      action: ChromeToBrowserMessagingActions.PING;
    }
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
      action: ChromeToBrowserMessagingActions.ACTIVATE_BROWSER;
      payload: ActivateBrowserPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.SET_FOCUS_LOCATION;
      payload: BrowserSetFocusLoationPayload;
    }
  | {
      action: ChromeToBrowserMessagingActions.SET_FOCUS;
      payload: BrowserSetFocusPayload;
    }
  | {
      action:
        | ChromeToBrowserMessagingActions.MOVE_UP
        | ChromeToBrowserMessagingActions.MOVE_DOWN
        | ChromeToBrowserMessagingActions.MOVE_LEFT
        | ChromeToBrowserMessagingActions.MOVE_RIGHT
        | ChromeToBrowserMessagingActions.ZOOM_BY;
      payload: {
        [key: string]: number;
      };
    };

export class BrowserMessagingService {
  private window: Window;
  private isRecepientReady = false;
  private subscribers: any = {};
  private outgoingMessageQueue: OutgoingPayload[] = [];

  public constructor(windowService: WindowServiceInterface) {
    this.window = windowService.getWindow();
    this.subscribeToMessages();
    this.subscribe('bpane-ready', this.onRecipientReady);
    this.ping();
  }

  private ping() {
    this.sendPostMessage({ action: ChromeToBrowserMessagingActions.PING });
  }

  private onRecipientReady = () => {
    this.isRecepientReady = true;

    this.outgoingMessageQueue.forEach((message) =>
      this.sendPostMessage(message)
    );
  };

  private sendPostMessage(message: OutgoingPayload) {
    this.window.postMessage({ type: 'bpane', ...message }, '*');
  }

  private subscribeToMessages() {
    this.window.addEventListener('message', this.handleMessage);
  }

  private addMessageToQueue(message: OutgoingPayload) {
    this.outgoingMessageQueue.push(message);
  }

  private handleMessage = (event: MessageEvent) => {
    const {
      data: { type, payload }
    } = event;
    if (!(type && payload)) {
      return;
    }
    const subscribers = this.subscribers[type];
    if (subscribers) {
      subscribers.forEach((subscriber: (payload: any) => void) =>
        subscriber(payload)
      );
    }
  };

  public subscribe = (
    eventName: string,
    callback: (...args: any[]) => void
  ) => {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = new Set();
    }

    this.subscribers[eventName].add(callback);

    return {
      unsubscribe: () => {
        this.subscribers[eventName].delete(callback);
      }
    };
  };

  public send = (payload: OutgoingPayload) => {
    // const message = {
    //   type: eventName,
    //   payload
    // };

    if (!this.isRecepientReady) {
      this.addMessageToQueue(payload);
    } else {
      this.sendPostMessage(payload);
    }
  };
}

export default new BrowserMessagingService(windowService);
