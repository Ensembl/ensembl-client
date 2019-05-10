import storageService from 'src/services/storage-service';
import windowService from 'src/services/window-service';

jest.mock('src/services/window-service', () => ({
  getLocalStorage: jest.fn(),
  getSessionStorage: jest.fn()
}));

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
      .spyOn(windowService, 'getLocalStorage')
      .mockImplementation(() => mockLocalStorage);
    jest
      .spyOn(windowService, 'getSessionStorage')
      .mockImplementation(() => mockSessionStorage);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('using local sotrage', () => {
    // This is the default behaviour of storageService

    describe('.get', () => {
      it('gets data from local storage if the data exists', () => {
        const key = 'foo';
        const storedValue = 'something';

        jest
          .spyOn(mockLocalStorage, 'getItem')
          .mockImplementation(() => JSON.stringify(storedValue));

        const result = storageService.get(key);

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(storedValue);
      });

      it('returns null if nothing is stored under provided key', () => {
        jest.spyOn(mockLocalStorage, 'getItem').mockImplementation(() => null);
      });
    });
  });
});
