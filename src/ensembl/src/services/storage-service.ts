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

import windowService, {
  WindowServiceInterface
} from 'src/services/window-service';
import mergeWith from 'lodash/mergeWith';
import JSONValue, { PrimitiveValue, ArrayValue } from 'src/shared/types/JSON';
import isArray from 'lodash/isArray';
import unset from 'lodash/unset';

export enum StorageType {
  LOCAL_STORAGE = 'localstorage',
  SESSION_STORAGE = 'sessionstorage'
}

type ValueForSaving = PrimitiveValue | ArrayValue | ArrayValue[] | JSONValue;

type options = {
  storage: StorageType;
};

export interface StorageServiceInterface {
  get: (key: string, options?: options) => any;
  save: (key: string, value: ValueForSaving, options?: options) => void;
  update: (key: string, fragment: JSONValue, options?: options) => void;
  remove: (key: string, options?: options) => void;
  removeAt: (
    key: string,
    pathOrPaths: string | string[],
    options?: options
  ) => void;
  clearAll: () => void;
}

const defaultOptions: options = {
  storage: StorageType.LOCAL_STORAGE
};

// We need to overwrite the arrays instead of merging them so that it is easier to remove entries
const mergeStrategy = (
  currentValue: JSONValue,
  newValue: JSONValue,
  key: string,
  object: JSONValue
) => {
  // Unset the property if the source value is undefined
  if (newValue === undefined) {
    unset(object, key);
  }

  if (Array.isArray(currentValue)) {
    return newValue;
  }
};

// named export is for testing;
// for development, use default export
export class StorageService implements StorageServiceInterface {
  private localStorage: Storage;
  private sessionStorage: Storage;

  public constructor(windowService: WindowServiceInterface) {
    if (typeof window === 'undefined') {
      // FIXME: when we rewrite storage-related services, make sure to avoid their eager initialization at import time
      // The two lines below are a temporary hack that will cause bugs if this service ever gets called server-side (it shouldn't)
      this.localStorage = {} as Storage;
      this.sessionStorage = {} as Storage;
      return;
    }
    this.localStorage = windowService.getLocalStorage();
    this.sessionStorage = windowService.getSessionStorage();
  }

  private chooseStorage(storage: StorageType) {
    return storage === StorageType.SESSION_STORAGE
      ? this.sessionStorage
      : this.localStorage;
  }

  public get(key: string, options = defaultOptions) {
    const storage = this.chooseStorage(options.storage);
    const savedValue = storage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : null;
  }

  public save(key: string, value: ValueForSaving, options = defaultOptions) {
    const storage = this.chooseStorage(options.storage);
    storage.setItem(key, JSON.stringify(value));
  }

  // intended only for updating part of the saved object
  public update(key: string, fragment: JSONValue, options = defaultOptions) {
    const storedData = this.get(key, options);
    if (storedData) {
      this.save(key, mergeWith(storedData, fragment, mergeStrategy), options);
    } else {
      this.save(key, fragment, options);
    }
  }

  public remove(key: string, options = defaultOptions) {
    const storage = this.chooseStorage(options.storage);
    storage.removeItem(key);
  }

  public removeAt(
    key: string,
    pathOrPaths: string | string[],
    options = defaultOptions
  ) {
    const paths = isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    const storedData = this.get(key, options);
    unset(storedData, paths);
    this.save(key, storedData, options);
  }

  public clearAll() {
    this.localStorage.clear();
    this.sessionStorage.clear();
  }
}

export default new StorageService(windowService);
