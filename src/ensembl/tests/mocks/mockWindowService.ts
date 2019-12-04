import { WindowServiceInterface } from 'src/services/window-service';

export const mockMatchMedia = () => () => ({
  matches: true,
  addListener: () => null
});

const mockWindowService: WindowServiceInterface = {
  getLocalStorage: jest.fn(),
  getSessionStorage: jest.fn(),
  getResizeObserver: jest.fn(),
  getMatchMedia: jest.fn().mockImplementation(() => () => ({
    matches: true,
    addListener: () => null
  })),
  getWindow: jest.fn(),
  getFileReader: jest.fn(),
  getLocation: jest.fn()
};

export default mockWindowService;
