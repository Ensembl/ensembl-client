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

import JSONValue from 'src/shared/types/JSON';

/*
  This is a service for communicating between genome browser and React wrapper.
*/

export class BrowserMessagingService {
  private window: Window;
  private isRecepientReady = false;
  private subscribers: any = {};
  private outgoingMessageQueue: JSONValue[] = [];

  public constructor(windowService: WindowServiceInterface) {
    if (typeof window === 'undefined') {
      this.window = {} as Window;
      return;
    }
    this.window = windowService.getWindow();
    this.subscribeToMessages();
    this.subscribe('bpane-ready', this.onRecipientReady);
    this.ping();
  }

  private ping() {
    this.sendPostMessage({ type: 'bpane-ready-query' });
  }

  private onRecipientReady = () => {
    this.isRecepientReady = true;

    this.outgoingMessageQueue.forEach((message) =>
      this.sendPostMessage(message)
    );
  };

  private sendPostMessage(message: JSONValue) {
    this.window.postMessage(message, '*');
  }

  private subscribeToMessages() {
    this.window.addEventListener('message', this.handleMessage);
  }

  private addMessageToQueue(message: JSONValue) {
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
      subscribers.forEach((subscriber: (payload?: any) => void) =>
        subscriber(payload)
      );
    }
  };

  public subscribe = (eventName: string, callback: (payload?: any) => void) => {
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

  public send = (eventName: string, payload: JSONValue) => {
    const message = {
      type: eventName,
      payload
    };

    if (!this.isRecepientReady) {
      this.addMessageToQueue(message);
    } else {
      this.sendPostMessage(message);
    }
  };
}

export default new BrowserMessagingService(windowService);
