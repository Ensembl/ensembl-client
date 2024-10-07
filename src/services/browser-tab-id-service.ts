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

import { nanoid } from '@reduxjs/toolkit';

/**
 * The purpose of this service is to create a unique id for a tab,
 * which can survive tab reloads.
 *
 * Important points to consider:
 *  - A tab has access to browser's session storage, which persists tab-specific
 *    data through page reloads, and is cleared when a tab (or the browser) is closed.
 *  - However, a tab that is "duplicated" in the browser shares the same
 *    session storage with its duplicate.
 *
 * This service creates a unique id for a tab, which it stores in-memory;
 * but also adds an event listener that fires before the page unloads
 * (e.g. during page refresh) and stores the id in the session storage.
 *
 * On app startup, the service will check the session storage for the tab id.
 * If there is a stored tab id, it will read it and immediately delete it.
 * If there is no stored tab id, it will create a new one.
 *
 * This approach is borrowed from https://stackoverflow.com/a/61415444/3925302
 */

const BROWSER_TAB_ID_STORAGE_KEY = 'browser-tab-id';

class BrowserTabIdService {
  static #browserTabId: string | null = null;

  static getBrowserTabId = () => {
    if (this.#browserTabId) {
      return this.#browserTabId;
    } else {
      return this.#readOrCreateBrowserTabId();
    }
  };

  static #readOrCreateBrowserTabId = () => {
    let browserTabId = window.sessionStorage.getItem(
      BROWSER_TAB_ID_STORAGE_KEY
    );

    if (browserTabId) {
      window.sessionStorage.removeItem(BROWSER_TAB_ID_STORAGE_KEY);
    } else {
      browserTabId = nanoid();
    }

    this.#browserTabId = browserTabId;
    this.#setListener();

    return browserTabId;
  };

  static #setListener = () => {
    window.addEventListener('beforeunload', this.#onPageUnload);
  };

  static #onPageUnload = () => {
    if (this.#browserTabId) {
      window.sessionStorage.setItem(
        BROWSER_TAB_ID_STORAGE_KEY,
        this.#browserTabId
      );
    }
  };
}

export default BrowserTabIdService;
