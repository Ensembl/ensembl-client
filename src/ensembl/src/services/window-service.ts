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
  getResizeObserver: () => typeof ResizeObserver;
  getMatchMedia: () => (query: string) => MediaQueryList;
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

  public getResizeObserver() {
    return ResizeObserver;
  }

  public getMatchMedia() {
    return window.matchMedia;
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
