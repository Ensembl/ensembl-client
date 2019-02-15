import bookmarkIcon from 'static/img/track-panel/bookmark.svg';
import bookmarkSelectedIcon from 'static/img/track-panel/bookmark-selected.svg';

import downloadIcon from 'static/img/track-panel/download.svg';
import downloadSelectedIcon from 'static/img/track-panel/download-selected.svg';

import searchIcon from 'static/img/track-panel/search.svg';
import searchSelectedIcon from 'static/img/track-panel/search-selected.svg';

import ownDataIcon from 'static/img/track-panel/own-data.svg';
import ownDataSelectedIcon from 'static/img/track-panel/own-data-selected.svg';

import shareIcon from 'static/img/track-panel/share.svg';
import shareSelectedIcon from 'static/img/track-panel/share-selected.svg';

import tracksManagerIcon from 'static/img/track-panel/tracks-manager.svg';
import tracksManagerSelectedIcon from 'static/img/track-panel/tracks-manager-selected.svg';

export type TrackPanelBarItem = {
  description: string;
  icon: {
    default: string;
    selected: string;
  };
  name: string;
};

export const trackPanelBarConfig: TrackPanelBarItem[] = [
  {
    description: 'Search',
    icon: {
      default: searchIcon,
      selected: searchSelectedIcon
    },
    name: 'search'
  },
  {
    description: 'Bookmark',
    icon: {
      default: bookmarkIcon,
      selected: bookmarkSelectedIcon
    },
    name: 'bookmark'
  },
  {
    description: 'Tracks manager',
    icon: {
      default: tracksManagerIcon,
      selected: tracksManagerSelectedIcon
    },
    name: 'tracks-manager'
  },
  {
    description: 'own data',
    icon: {
      default: ownDataIcon,
      selected: ownDataSelectedIcon
    },
    name: 'own-data'
  },
  {
    description: 'Share',
    icon: {
      default: shareIcon,
      selected: shareSelectedIcon
    },
    name: 'share'
  },
  {
    description: 'Download',
    icon: {
      default: downloadIcon,
      selected: downloadSelectedIcon
    },
    name: 'download'
  }
];
