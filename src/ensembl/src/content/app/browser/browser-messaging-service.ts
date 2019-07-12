import JSONValue from 'src/shared/types/JSON';

/*
  This is a service for communicating between genome browser and React wrapper.
  It currently relies on dispatching and listening to events
*/

class BrowserMessagingService {
  private isRecepientReady: boolean = false;
  private subscribers: any = {};
  private outgoingMessageQueue: JSONValue[] = [];

  public constructor() {
    this.subscribeToMessages();
    this.subscribe('bpane-ready', this.onRecepientReady);
    this.ping();
  }

  public ping() {
    this.sendPostMessage({ type: 'bpane-ready-query' });
  }

  public onRecepientReady = () => {
    console.log('RECEIVED PONG!!!');
    this.isRecepientReady = true;

    this.outgoingMessageQueue.forEach((message) =>
      this.sendPostMessage(message)
    );
  };

  private sendPostMessage(message: JSONValue) {
    console.log('SENDING MESSAGE', message);
    window.postMessage(message, '*');
  }

  private subscribeToMessages() {
    window.addEventListener('message', this.handleMessage, false);
  }

  private addMessageToQueue(message: JSONValue) {
    this.outgoingMessageQueue.push(message);
  }

  private handleMessage = (event: any) => {
    // FIXME - type
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

  public subscribe = (eventName: string, callback: EventListener) => {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = new Set();
      this.subscribers[eventName].add(callback);
    }

    // TODO: when changing into proper service, return subscription object with unsubscribe method
    // and use unsubscribe in cleanup function of useEffect
    // return {
    //   unsubscribe() {
    //   }
    // };
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

  // temporary solution until we stop listening for events
  // from the genome browser dom element directly
  // public setup(browserElement: HTMLDivElement) {
  //   this.browserElement = browserElement;

  //   const eventNames = Object.keys(this.subscribers);
  //   eventNames.forEach((eventName) => {
  //     this.subscribeInternal(eventName);
  //   });
  // }

  // temporary solution until we stop listening for events
  // from the genome browser dom element directly
  // public onUnmount() {
  //   const eventNames = Object.keys(this.subscribers);
  //   eventNames.forEach((eventName) => {
  //     (this.browserElement as HTMLDivElement).removeEventListener(
  //       eventName,
  //       this.mediator
  //     );
  //   });

  //   this.browserElement = undefined;
  //   this.subscribers = {};
  // }

  // private subscribeInternal = (eventName: string) => {
  //   if (!this.browserElement) {
  //     return;
  //   }
  //   this.browserElement.addEventListener(eventName, this.mediator);
  // };

  // private mediator = (event: any) => {
  //   const { type } = event;
  //   const subscribers = this.subscribers[type];
  //   if (subscribers) {
  //     subscribers.forEach((subscriber: Function) => subscriber(event));
  //   }
  // };
}

export default new BrowserMessagingService();
