import { BrowserStorageService, StorageKeys } from './browser-storage-service';
import { ImageButtonStatus } from 'src/shared/components/image-button/ImageButton';
import { TrackSet } from './track-panel/trackPanelConfig';

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

const trackListToggleStates = {
  'gene-feat': false
};

const SELECTED_TRACK_PANEL_TAB = TrackSet.VARIATION;

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

  describe('.getTrackListToggleStates()', () => {
    it('gets saved track list toggle states from storage service', () => {
      jest
        .spyOn(mockStorageService, 'get')
        .mockImplementation(() => trackListToggleStates);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const result = browserStorageService.getTrackListToggleStates();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.TRACK_LIST_TOGGLE_STATES
      );
      expect(result).toEqual(trackListToggleStates);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved track list toggle states', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );
      const result = browserStorageService.getTrackListToggleStates();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateTrackListToggleStates()', () => {
    it('updates track list toggle states via storage service', () => {
      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const toggledTrackState = { homo_sapiens38: { 'gene-feat': true } };

      browserStorageService.updateTrackListToggleStates(toggledTrackState);

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.TRACK_LIST_TOGGLE_STATES,
        toggledTrackState
      );
    });
  });

  describe('.getSelectedTrackPanelTab()', () => {
    it('gets saved selected browser tab from storage service', () => {
      jest
        .spyOn(mockStorageService, 'get')
        .mockImplementation(() => SELECTED_TRACK_PANEL_TAB);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const result = browserStorageService.getSelectedTrackPanelTab();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.SELECTED_TRACK_PANEL_TAB
      );
      expect(result).toEqual(SELECTED_TRACK_PANEL_TAB);

      mockStorageService.get.mockRestore();
    });

    it('returns "GENOMIC" if there is no saved selected browser tab', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );
      const result = browserStorageService.getSelectedTrackPanelTab();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateSelectedTrackPanelTab()', () => {
    it('updates selected browser tab via storage service', () => {
      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      browserStorageService.updateSelectedTrackPanelTab({
        homo_sapiens38: TrackSet.EXPRESSION
      });

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.SELECTED_TRACK_PANEL_TAB,
        {
          homo_sapiens38: TrackSet.EXPRESSION
        }
      );
    });
  });
});
