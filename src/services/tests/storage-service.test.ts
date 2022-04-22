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

import { StorageService, StorageType } from 'src/services/storage-service';
import faker from '@faker-js/faker';

import mockWindowService from 'tests/mocks/mockWindowService';

const mockLocalStorage: any = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

const mockSessionStorage: any = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

describe('storageService', () => {
  beforeEach(() => {
    jest
      .spyOn(mockWindowService, 'getLocalStorage')
      .mockImplementation(() => mockLocalStorage);
    jest
      .spyOn(mockWindowService, 'getSessionStorage')
      .mockImplementation(() => mockSessionStorage);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('using local storage', () => {
    // This is the default behaviour of storageService

    describe('.get()', () => {
      it('gets data from local storage if the data exists', () => {
        const key = faker.lorem.word();
        const storedValue = faker.lorem.words();

        jest
          .spyOn(mockLocalStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(storedValue));

        const storageService = new StorageService(mockWindowService);
        const result = storageService.get(key);

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(storedValue);

        mockLocalStorage.getItem.mockRestore();
      });

      it('returns null if nothing is stored under provided key', () => {
        const key = faker.lorem.word();
        jest.spyOn(mockLocalStorage, 'getItem').mockImplementation(() => null);

        const storageService = new StorageService(mockWindowService);
        const result = storageService.get(key);

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(null);

        mockLocalStorage.getItem.mockRestore();
      });
    });

    describe('.save()', () => {
      it('saves JSON-stringified value in local storage', () => {
        const key = faker.lorem.word();
        const value = faker.lorem.words();

        const storageService = new StorageService(mockWindowService);
        storageService.save(key, value);

        const [passedKey, passedValue] = mockLocalStorage.setItem.mock.calls[0];

        expect(passedKey).toBe(key);
        expect(passedValue).toBe(JSON.stringify(value));
      });
    });

    describe('.update()', () => {
      it('saves an updated object under the same key', () => {
        const key = faker.lorem.word();
        const key1 = faker.lorem.word();
        const key2 = faker.lorem.word();
        const key3 = faker.lorem.word();
        const arrayKey1 = faker.lorem.word();
        const arrayKey2 = faker.lorem.word();

        const value = faker.lorem.words();
        const value1 = faker.lorem.words();
        const value2 = faker.lorem.words();
        const value3 = faker.lorem.words();
        const arrayValue1 = [faker.lorem.words()];
        const arrayValue2 = [faker.lorem.words()];
        const arrayValue3 = [faker.lorem.words()];

        const obj = {
          [key1]: value,
          [key3]: value3,
          [arrayKey1]: arrayValue1,
          [arrayKey2]: arrayValue2
        };
        const updateObj = {
          [key1]: value2,
          [key3]: undefined,
          [arrayKey1]: [],
          [arrayKey2]: arrayValue3,
          [key2]: value1
        };

        jest
          .spyOn(mockLocalStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(obj));

        const storageService = new StorageService(mockWindowService);
        storageService.update(key, updateObj);

        const [passedKey, passedValue] = mockLocalStorage.setItem.mock.calls[0];

        expect(passedKey).toBe(key);
        expect(passedValue).toBe(JSON.stringify(updateObj));

        mockLocalStorage.getItem.mockRestore();
      });
    });

    describe('.remove()', () => {
      it('removes value stored under provided key', () => {
        const key = faker.lorem.word();

        const storageService = new StorageService(mockWindowService);
        storageService.remove(key);

        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(key);
      });
    });

    describe('.removeAt()', () => {
      it('removes a particular entry from the value object for the given path', () => {
        const key = faker.lorem.word();
        const key1 = faker.lorem.word();
        const key2 = faker.lorem.word();

        const obj = {
          [key]: {
            [key1]: {
              [key2]: {
                foo: 1,
                bar: 1
              }
            }
          }
        };

        const updateObj = {
          [key]: {
            [key1]: {
              [key2]: {
                bar: 1
              }
            }
          }
        };

        jest
          .spyOn(mockLocalStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(obj));

        const storageService = new StorageService(mockWindowService);
        storageService.removeAt(key, [key, key1, key2, 'foo'], {
          storage: StorageType.LOCAL_STORAGE
        });

        const [passedKey, passedValue] = mockLocalStorage.setItem.mock.calls[0];

        expect(passedKey).toBe(key);
        expect(passedValue).toBe(JSON.stringify(updateObj));
      });
    });
  });

  describe('using session storage', () => {
    // Session storage will be used if the appropriate option is provided

    describe('.get()', () => {
      it('gets data from session storage if the data exists', () => {
        const key = faker.lorem.word();
        const storedValue = faker.lorem.words();

        jest
          .spyOn(mockSessionStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(storedValue));

        const storageService = new StorageService(mockWindowService);
        const result = storageService.get(key, {
          storage: StorageType.SESSION_STORAGE
        });

        expect(mockSessionStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(storedValue);

        mockSessionStorage.getItem.mockRestore();
      });

      it('returns null if nothing is stored under provided key', () => {
        const key = faker.lorem.word();
        jest
          .spyOn(mockSessionStorage, 'getItem')
          .mockImplementation(() => null);

        const storageService = new StorageService(mockWindowService);
        const result = storageService.get(key, {
          storage: StorageType.SESSION_STORAGE
        });

        expect(mockSessionStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(null);

        mockSessionStorage.getItem.mockRestore();
      });
    });

    describe('.save()', () => {
      it('saves JSON-stringified value in session storage', () => {
        const key = faker.lorem.word();
        const value = faker.lorem.words();

        const storageService = new StorageService(mockWindowService);
        storageService.save(key, value, {
          storage: StorageType.SESSION_STORAGE
        });

        const [passedKey, passedValue] =
          mockSessionStorage.setItem.mock.calls[0];

        expect(passedKey).toBe(key);
        expect(passedValue).toBe(JSON.stringify(value));
      });
    });

    describe('.update()', () => {
      it('saves an updated object under the same key', () => {
        const key = faker.lorem.word();
        const key1 = faker.lorem.word();
        const key2 = faker.lorem.word();
        const arrayKey1 = faker.lorem.word();
        const arrayKey2 = faker.lorem.word();

        const value1 = faker.lorem.words();
        const value2 = faker.lorem.words();
        const value3 = faker.lorem.words();
        const arrayValue1 = [faker.lorem.words()];
        const arrayValue2 = [faker.lorem.words()];
        const arrayValue3 = [faker.lorem.words()];

        const obj = {
          [key1]: value1,
          [arrayKey1]: arrayValue1,
          [arrayKey2]: arrayValue2
        };
        const updateObj = {
          [key1]: value3,
          [arrayKey1]: [],
          [arrayKey2]: arrayValue3,
          [key2]: value2
        };

        jest
          .spyOn(mockSessionStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(obj));

        const storageService = new StorageService(mockWindowService);
        storageService.update(key, updateObj, {
          storage: StorageType.SESSION_STORAGE
        });

        const [passedKey, passedValue] =
          mockSessionStorage.setItem.mock.calls[0];

        expect(passedKey).toBe(key);
        expect(passedValue).toBe(JSON.stringify(updateObj));
      });
    });

    describe('.remove()', () => {
      it('removes value stored under provided key', () => {
        const key = faker.lorem.word();

        const storageService = new StorageService(mockWindowService);
        storageService.remove(key, { storage: StorageType.SESSION_STORAGE });

        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(key);
      });
    });

    describe('.removeAt()', () => {
      it('removes a particular entry from the value object for the given path', () => {
        const key = faker.lorem.word();
        const key1 = faker.lorem.word();
        const key2 = faker.lorem.word();

        const obj = {
          [key]: {
            [key1]: {
              [key2]: {
                foo: 1,
                bar: 1
              }
            }
          }
        };

        const updateObj = {
          [key]: {
            [key1]: {
              [key2]: {
                bar: 1
              }
            }
          }
        };

        jest
          .spyOn(mockSessionStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(obj));

        const storageService = new StorageService(mockWindowService);
        storageService.removeAt(key, [key, key1, key2, 'foo'], {
          storage: StorageType.SESSION_STORAGE
        });

        const [passedKey, passedValue] =
          mockSessionStorage.setItem.mock.calls[0];

        expect(passedKey).toBe(key);
        expect(passedValue).toBe(JSON.stringify(updateObj));
      });
    });
  });

  describe('clearAll', () => {
    it('clears both localStorage and sessionStorage', () => {
      const storageService = new StorageService(mockWindowService);
      storageService.clearAll();

      expect(mockLocalStorage.clear).toHaveBeenCalled();
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });
  });
});
