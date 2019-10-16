import { BrowserStorageService, StorageKeys } from './browser-storage-service';
import { ImageButtonStatus } from 'src/shared/components/image-button/ImageButton';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn()
};

const trackStates = {
  main: {
    'gene-feat': 'active'
  },
  Assembly: {
    gc: 'inactive'
  }
};

describe('BrowserStorageService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.getTrackStates()', () => {
    it('gets saved track states from storage service', () => {
      jest
        .spyOn(mockStorageService, 'get')
        .mockImplementation(() => trackStates);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const result = browserStorageService.getTrackStates();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.TRACK_STATES
      );
      expect(result).toEqual(trackStates);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved track states', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );
      const result = browserStorageService.getTrackStates();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.saveTrackStates()', () => {
    it('saves track states via storage service', () => {
      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const toggledTrack = {
        homo_sapiens38: {
          'Genes & transcripts': {
            'gene-pc-fwd': ImageButtonStatus.INACTIVE
          }
        }
      };

      browserStorageService.saveTrackStates(toggledTrack);

      expect(mockStorageService.save).toHaveBeenCalledWith(
        StorageKeys.TRACK_STATES,
        toggledTrack
      );
    });
  });

  describe('.getTrackPanels()', () => {
    it('gets saved track panels configuration from storage service', () => {
      const mockTrackPanels = { foo: 'doesnt really matter' };
      jest
        .spyOn(mockStorageService, 'get')
        .mockImplementation(() => mockTrackPanels);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const result = browserStorageService.getTrackPanels();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.TRACK_PANELS
      );
      expect(result).toEqual(mockTrackPanels);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved track panel configurations', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );
      const result = browserStorageService.getTrackPanels();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateTrackPanels()', () => {
    it('updates stored track panel configurations', () => {
      const mockTrackPanels = { foo: {} };
      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      browserStorageService.updateTrackPanels(mockTrackPanels);

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.TRACK_PANELS,
        mockTrackPanels
      );
    });
  });
});
