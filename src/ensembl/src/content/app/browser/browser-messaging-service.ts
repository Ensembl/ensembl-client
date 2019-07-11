import JSONValue from 'src/shared/types/JSON';

/*
  This is a service for communicating between genome browser and React wrapper.
  It currently relies on dispatching and listening to events 
*/

class BrowserMessagingService {
  private browserElement?: HTMLDivElement;

  // temporary solution until we stop listening for events
  // from the genome browser dom element directly
  public setup(browserElement: HTMLDivElement) {
    console.log('was in setup; browserElement', browserElement);
    this.browserElement = browserElement;
  }

  // temporary solution until we stop listening for events
  // from the genome browser dom element directly
  public onUnmount() {
    this.browserElement = undefined;
  }

  public subscribe = (eventName: string, callback: EventListener) => {
    const browserElement = this.browserElement as HTMLDivElement;
    browserElement.addEventListener(eventName, callback);

    return {
      unsubscribe() {
        browserElement.removeEventListener(eventName, callback);
      }
    };
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
