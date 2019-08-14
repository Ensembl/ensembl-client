import {
  TrackPanelStorageService,
  StorageKeys
} from './track-panel-storage-service';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';
import { Bookmark } from './trackPanelState';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn()
};

const bookmarks = {
  homo_sapiens_GCA_000001405_27: [
    {
      genome_id: 'homo_sapiens_GCA_000001405_27',
      object_id: 'homo_sapiens_GCA_000001405_27:gene:ENSG00000139618',
      object_type: 'gene',
      label: 'BRCA2',
      location: {
        chromosome: '13',
        end: 32400266,
        start: 32315086
      },
      trackStates: {
        'genes-transcripts': {
          'gene-pc-fwd': ImageButtonStatus.INACTIVE
        },
        main: {
          'gene-feat': ImageButtonStatus.INACTIVE,
          'gene-feat-1': ImageButtonStatus.INACTIVE
        }
      }
    }
  ]
};

describe('TrackPanelStorageService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.getBookmarks()', () => {
    it('gets saved bookmarks from storage service', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => bookmarks);

      const trackPanelStorageService = new TrackPanelStorageService(
        mockStorageService
      );

      const result = trackPanelStorageService.getBookmarks();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.BOOKMARKS
      );
      expect(result).toEqual(bookmarks);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved bookmarks', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const trackPanelStorageService = new TrackPanelStorageService(
        mockStorageService
      );
      const result = trackPanelStorageService.getBookmarks();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateActiveGenomeBookmarks()', () => {
    it('updates active genome bookmarks via storage service', () => {
      const trackPanelStorageService = new TrackPanelStorageService(
        mockStorageService
      );

      const updatedBookmarks: { [genomeId: string]: Bookmark[] } = {
        homo_sapiens_GCA_000001405_27: [
          {
            genome_id: 'homo_sapiens_GCA_000001405_27',
            object_id: 'homo_sapiens_GCA_000001405_27:gene:ENSG00000139618',
            object_type: 'gene',
            label: 'BRCA2',
            location: {
              chromosome: '13',
              end: 32400266,
              start: 32315086
            },
            trackStates: {
              'genes-transcripts': {
                'gene-pc-fwd': ImageButtonStatus.INACTIVE
              }
            }
          }
        ]
      };

      trackPanelStorageService.updateActiveGenomeBookmarks(updatedBookmarks);

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.BOOKMARKS,
        updatedBookmarks
      );
    });
  });
});
