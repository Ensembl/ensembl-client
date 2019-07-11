import JSONValue from 'src/shared/types/JSON';

/*
  This is a service for communicating between genome browser and React wrapper.
  It currently relies on dispatching and listening to events
*/

class BrowserMessagingService {
  private browserElement?: HTMLDivElement;
  private subscribers: any = {};

  // temporary solution until we stop listening for events
  // from the genome browser dom element directly
  public setup(browserElement: HTMLDivElement) {
    this.browserElement = browserElement;

    const eventNames = Object.keys(this.subscribers);
    eventNames.forEach((eventName) => {
      this.subscribeInternal(eventName);
    });
  }

  // temporary solution until we stop listening for events
  // from the genome browser dom element directly
  public onUnmount() {
    const eventNames = Object.keys(this.subscribers);
    eventNames.forEach((eventName) => {
      (this.browserElement as HTMLDivElement).removeEventListener(
        eventName,
        this.mediator
      );
    });

    this.browserElement = undefined;
    this.subscribers = {};
  }

  private subscribeInternal = (eventName: string) => {
    if (!this.browserElement) {
      return;
    }
    this.browserElement.addEventListener(eventName, this.mediator);
  };

  private mediator = (event: any) => {
    const { type } = event;
    const subscribers = this.subscribers[type];
    if (subscribers) {
      subscribers.forEach((subscriber: Function) => subscriber(event));
    }
  };

  public subscribe = (eventName: string, callback: EventListener) => {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = new Set();
      this.subscribeInternal(eventName);
    }
    this.subscribers[eventName].add(callback);

    // TODO: when changing into proper service, return subscription object with unsubscribe method
    // and use unsubscribe in cleanup function of useEffect
    // return {
    //   unsubscribe() {
    //   }
    // };
  };

  public send = (eventName: string, payload: JSONValue) => {
    if (!this.browserElement) {
      return;
    }

    const event = new CustomEvent(eventName, {
      bubbles: true,
      detail: payload
    });
    (this.browserElement as HTMLDivElement).dispatchEvent(event);
  };
}

export default new BrowserMessagingService();
