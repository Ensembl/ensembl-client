import windowService, {
  WindowServiceInterface
} from 'src/services/window-service';

import JSONValue from 'src/shared/types/JSON';

/*
  This is a service for communicating between genome browser and React wrapper.
*/

export class BrowserMessagingService {
  private window: Window;
  private isRecepientReady: boolean = false;
  private subscribers: any = {};
  private outgoingMessageQueue: JSONValue[] = [];

  public constructor(windowService: WindowServiceInterface) {
    this.window = windowService.getWindow();
    this.subscribeToMessages();
    this.subscribe('bpane-ready', this.onRecepientReady);
    this.ping();
  }

  private ping() {
    this.sendPostMessage({ type: 'bpane-ready-query' });
  }

  private onRecepientReady = () => {
    console.log('RECEIVED PONG!!!');
    this.isRecepientReady = true;

    this.outgoingMessageQueue.forEach((message) =>
      this.sendPostMessage(message)
    );
  };

  private sendPostMessage(message: JSONValue) {
    console.log('SENDING MESSAGE', message);
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
      subscribers.forEach((subscriber: Function) => subscriber(payload));
    }
  };

  public subscribe = (eventName: string, callback: Function) => {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = new Set();
      this.subscribers[eventName].add(callback);
    }

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
