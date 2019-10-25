import faker from 'faker';

import { Status } from 'src/shared/types/status';
import { TrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { TrackPanelBarItem } from 'src/content/app/browser/track-panel/track-panel-bar/trackPanelBarConfig';
import { EnsObjectTrack } from 'src/ens-object/ensObjectTypes';

import { ReactComponent as bookmarkIcon } from 'static/img/track-panel/bookmark.svg';

export const createTrackStates = (): TrackStates => ({
  triticum_aestivum_GCA_900519105_1: {
    [faker.lorem.words()]: {
      [faker.lorem.words()]: Status.ACTIVE,
      [faker.lorem.words()]: Status.INACTIVE
    }
  }
});

export const createTrackPanelBarItem = (): TrackPanelBarItem => ({
  description: 'Bookmarks',
  icon: bookmarkIcon,
  name: 'bookmarks'
});

export const createTrackInfo = (): EnsObjectTrack => ({
  additional_info: faker.lorem.words(),
  description: faker.lorem.words(),
  label: faker.lorem.words(),
  track_id: 'gene-pc-fwd'
});

export const createMainTrackInfo = (): EnsObjectTrack => ({
  additional_info: faker.lorem.words(),
  child_tracks: [
    {
      additional_info: faker.lorem.words(),
      colour: faker.lorem.words(),
      description: faker.lorem.words(),
      label: faker.lorem.words(),
      support_level: faker.lorem.words(),
      track_id: 'gene-feat-1'
    }
  ],
  description: faker.lorem.words(),
  ensembl_object_id: faker.lorem.words(),
  label: faker.lorem.words(),
  track_id: 'gene-feat'
});
