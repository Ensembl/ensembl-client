/**
 * This is a simple service whose purpose is to return objects from the window object.
 * This is helpful for mocking elements of the browser API during tests.
 */

export interface WindowServiceInterface {
  getWindow: () => Window;
  getLocalStorage: () => Storage;
  getSessionStorage: () => Storage;
  getLocation: () => Location;
}

class WindowService implements WindowServiceInterface {
  public getWindow() {
    return window;
  }

  public getLocalStorage() {
    return window.localStorage;
  }

  public getSessionStorage() {
    return window.sessionStorage;
  }

  public getLocation() {
    return window.location;
  }
}

export default new WindowService();
