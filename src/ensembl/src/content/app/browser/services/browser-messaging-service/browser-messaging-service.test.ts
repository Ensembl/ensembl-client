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

import faker from 'faker';

import {
  BrowserMessagingService,
  BrowserMessagingType
} from './browser-messaging-service';

import windowService from 'src/services/window-service';
import { BrowserToChromeMessagingAction } from 'src/content/app/browser/services/browser-messaging-service/browser-incoming-message-types';

const createDummyMessage = (): any => {
  const key = faker.lorem.word();
  const value = faker.lorem.word();
  const action = faker.lorem.word();

  return {
    action,
    payload: {
      [key]: value
    }
  };
};

class MockWindow {
  private subscribers: { [name: string]: ((...args: any[]) => void)[] } = {};

  public postMessage = jest.fn();

  public addEventListener = (
    name: string,
    callback: (...args: any[]) => void
  ) => {
    if (!this.subscribers[name]) {
      this.subscribers[name] = [];
    }
    this.subscribers[name].push(callback);
  };

  public sendMessage(name: string, payload: any) {
    this.subscribers[name] &&
      this.subscribers[name].forEach((callback) => callback({ data: payload }));
  }
}

describe('browserMessagingService', () => {
  let mockWindow: any;

  beforeEach(() => {
    mockWindow = new MockWindow();
    windowService.getWindow = jest.fn().mockImplementation(() => mockWindow);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.constructor', () => {
    test('sends "bpane-ready-query" message', () => {
      new BrowserMessagingService(windowService);
      expect(mockWindow.postMessage).toHaveBeenCalled();

      const sentMessage = mockWindow.postMessage.mock.calls[0][0];
      expect(sentMessage.type).toBe('bpane-ready-query');
    });
  });

  describe('.send()', () => {
    test('does not send messages until notified that genome browser is ready', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      // clear recorded 'bpane-ready-query' message
      mockWindow.postMessage.mockClear();

      browserMessagingService.send(createDummyMessage());
      browserMessagingService.send(createDummyMessage());

      expect(mockWindow.postMessage).not.toHaveBeenCalled();
    });

    test('plays back messages queued while browser was not ready', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      // clear recorded 'bpane-ready-query' message
      mockWindow.postMessage.mockClear();

      const message1 = createDummyMessage();
      const message2 = createDummyMessage();

      browserMessagingService.send(message1);
      browserMessagingService.send(message2);

      expect(mockWindow.postMessage).not.toHaveBeenCalled();

      mockWindow.sendMessage('message', {
        type: BrowserMessagingType.BPANE_OUT,
        action: BrowserToChromeMessagingAction.GENOME_BROWSER_READY
      });

      expect(mockWindow.postMessage).toHaveBeenCalledTimes(2);
      expect(mockWindow.postMessage.mock.calls[0][0]).toEqual({
        ...message1,
        type: BrowserMessagingType.BPANE
      });
      expect(mockWindow.postMessage.mock.calls[1][0]).toEqual({
        ...message2,
        type: BrowserMessagingType.BPANE
      });
    });

    test('sends messages normally after "bpane-ready" event was received', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      // clear recorded 'bpane-ready-query' message
      mockWindow.postMessage.mockClear();
      mockWindow.sendMessage('message', {
        type: BrowserMessagingType.BPANE_OUT,
        action: BrowserToChromeMessagingAction.GENOME_BROWSER_READY
      });

      const message = createDummyMessage();
      browserMessagingService.send(message);

      expect(mockWindow.postMessage.mock.calls[0][0]).toEqual({
        ...message,
        type: BrowserMessagingType.BPANE
      });
    });
  });

  describe('.subscribe()', () => {
    test('subscribes callback to messages of provided type', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      const message = {
        ...createDummyMessage(),
        type: BrowserMessagingType.BPANE_OUT
      };
      const callback = jest.fn();
      const subscription = browserMessagingService.subscribe(
        message.action,
        callback
      );

      mockWindow.sendMessage('message', message);

      expect(callback).toHaveBeenCalledWith(message.payload);
      callback.mockClear();

      // check that the callback stops being called after unsubscribing
      subscription.unsubscribe();

      mockWindow.sendMessage('message', message);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
