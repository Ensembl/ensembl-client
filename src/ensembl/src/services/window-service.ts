/**
 * This is a simple service whose purpose is to return objects from the window object.
 * This is helpful for mocking elements of the browser API during tests.
 */

export interface WindowServiceInterface {
  getWindow: () => Window;
  getLocalStorage: () => Storage;
  getSessionStorage: () => Storage;
  getLocation: () => Location;
  getFileReader: () => FileReader;
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

  public getFileReader() {
    return new FileReader();
  }

  // return viewport dimensions in the ClientRect format
  public getDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      x: 0,
      y: 0,
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height
    };
  }
}

export default new WindowService();
