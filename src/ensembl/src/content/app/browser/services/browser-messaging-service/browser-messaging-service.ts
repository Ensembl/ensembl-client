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

/*
  This is a service for communicating between genome browser and React wrapper.
*/

import windowService, {
  WindowServiceInterface
} from 'src/services/window-service';
import {
  OutgoingMessage,
  ActivateBrowserPayload
} from './browser-message-creator';
import { BrowserToChromeMessagingActions } from 'src/content/app/browser/services/browser-messaging-service/browser-incoming-message-types';

export enum BrowserMessagingType {
  BPANE_READY_QUERY = 'bpane-ready-query',
  BPANE_ACTIVATE = 'bpane-activate',
  BPANE = 'bpane',
  BPANE_READY = 'bpane-ready'
}

export class BrowserMessagingService {
  private window: Window;
  private isRecepientReady = false;
  private subscribers: any = {};
  private outgoingMessageQueue: OutgoingMessage[] = [];

  public constructor(windowService: WindowServiceInterface) {
    this.window = windowService.getWindow();
    this.subscribeToMessages();
    this.subscribe(
      BrowserToChromeMessagingActions.GENOME_BROWSER_READY,
      this.onRecipientReady
    );
    this.ping();
  }

  private ping() {
    this.window.postMessage(
      {
        type: BrowserMessagingType.BPANE_READY_QUERY
      },
      '*'
    );
  }

  public activate(payload: ActivateBrowserPayload) {
    this.window.postMessage(
      { ...payload, type: BrowserMessagingType.BPANE_ACTIVATE },
      '*'
    );
  }

  private onRecipientReady = () => {
    this.isRecepientReady = true;

    this.outgoingMessageQueue.forEach((message) =>
      this.sendPostMessage(message)
    );
  };

  private sendPostMessage(message: OutgoingMessage) {
    this.window.postMessage(
      { type: BrowserMessagingType.BPANE, ...message },
      '*'
    );
  }

  private subscribeToMessages() {
    this.window.addEventListener('message', this.handleMessage);
  }

  private addMessageToQueue(message: OutgoingMessage) {
    this.outgoingMessageQueue.push(message);
  }

  private handleMessage = (event: MessageEvent) => {
    const {
      data: { payload: message }
    } = event;
    if (!(message && message.action)) {
      return;
    }
    const subscribers = this.subscribers[message.action];
    if (subscribers) {
      subscribers.forEach((subscriber: (message: any) => void) =>
        subscriber(message.payload)
      );
    }
  };

  public subscribe = (
    actions:
      | BrowserToChromeMessagingActions
      | BrowserToChromeMessagingActions[],
    callback: (...args: any[]) => void
  ) => {
    if (typeof actions === 'string') {
      if (!this.subscribers[actions]) {
        this.subscribers[actions] = new Set();
      }

      this.subscribers[actions].add(callback);
    } else if (Array.isArray(actions)) {
      actions.forEach((action: BrowserToChromeMessagingActions) => {
        if (!this.subscribers[action]) {
          this.subscribers[action] = new Set();
        }

        this.subscribers[action].add(callback);
      });
    }

    return {
      unsubscribe: () => {
        if (typeof actions === 'string') {
          this.subscribers[actions].delete(callback);
        } else if (Array.isArray(actions)) {
          actions.forEach((action: BrowserToChromeMessagingActions) => {
            this.subscribers[action].delete(callback);
          });
        }
      }
    };
  };

  public send = (payload: OutgoingMessage) => {
    if (!this.isRecepientReady) {
      this.addMessageToQueue(payload);
    } else {
      this.sendPostMessage(payload);
    }
  };
}

export default new BrowserMessagingService(windowService);
