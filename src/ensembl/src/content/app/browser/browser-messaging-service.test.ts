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

import { BrowserMessagingService } from './browser-messaging-service';
import faker from 'faker';

import windowService from 'src/services/window-service';

class MockWindow {
  private subscribers: { [name: string]: ((payload?: any) => void)[] } = {};

  public postMessage = jest.fn();

  public addEventListener = (
    name: string,
    callback: (payload?: any) => void
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
    test('does not send messages until it receives "bpane-ready" event', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      // clear recorded 'bpane-ready-query' message
      mockWindow.postMessage.mockClear();

      browserMessagingService.send(faker.lorem.word(), {
        [faker.lorem.word()]: faker.lorem.word()
      });
      browserMessagingService.send(faker.lorem.word(), {
        [faker.lorem.word()]: faker.lorem.word()
      });

      expect(mockWindow.postMessage).not.toHaveBeenCalled();
    });

    test('plays back messages sent before "bpane-ready" event was received', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      // clear recorded 'bpane-ready-query' message
      mockWindow.postMessage.mockClear();

      const messageName1 = faker.lorem.word();
      const messagePayload1 = { [faker.lorem.word()]: faker.lorem.word() };
      const messageName2 = faker.lorem.word();
      const messagePayload2 = { [faker.lorem.word()]: faker.lorem.word() };
      browserMessagingService.send(messageName1, messagePayload1);
      browserMessagingService.send(messageName2, messagePayload2);

      expect(mockWindow.postMessage).not.toHaveBeenCalled();

      mockWindow.sendMessage('message', { type: 'bpane-ready', payload: {} });

      expect(mockWindow.postMessage).toHaveBeenCalledTimes(2);
      expect(mockWindow.postMessage.mock.calls[0][0]).toEqual({
        type: messageName1,
        payload: messagePayload1
      });
      expect(mockWindow.postMessage.mock.calls[1][0]).toEqual({
        type: messageName2,
        payload: messagePayload2
      });
    });

    test('sends messages normally after "bpane-ready" event was received', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      // clear recorded 'bpane-ready-query' message
      mockWindow.postMessage.mockClear();
      mockWindow.sendMessage('message', { type: 'bpane-ready', payload: {} });

      const messageName = faker.lorem.word();
      const messagePayload = { [faker.lorem.word()]: faker.lorem.word() };
      browserMessagingService.send(messageName, messagePayload);

      expect(mockWindow.postMessage.mock.calls[0][0]).toEqual({
        type: messageName,
        payload: messagePayload
      });
    });
  });

  describe('.subscribe()', () => {
    test('subscribes callback to messages of provided type', () => {
      const browserMessagingService = new BrowserMessagingService(
        windowService
      );
      const messageType = faker.lorem.word();
      const callback = jest.fn();
      const payload = { [faker.lorem.word()]: faker.lorem.word() };
      const subscription = browserMessagingService.subscribe(
        messageType,
        callback
      );

      mockWindow.sendMessage('message', { type: messageType, payload });

      expect(callback).toHaveBeenCalledWith(payload);
      callback.mockClear();

      // check that the callback stops being called after unsubscribing
      subscription.unsubscribe();

      mockWindow.sendMessage('message', { type: messageType, payload });

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
