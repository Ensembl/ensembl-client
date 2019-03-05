import bookmarkIcon from 'static/img/track-panel/bookmark.svg';
import bookmarkSelectedIcon from 'static/img/track-panel/bookmark-selected.svg';

import downloadIcon from 'static/img/track-panel/download.svg';
import downloadSelectedIcon from 'static/img/track-panel/download-selected.svg';

import searchIcon from 'static/img/track-panel/search.svg';
import searchSelectedIcon from 'static/img/track-panel/search-selected.svg';

import personalDataIcon from 'static/img/track-panel/own-data.svg';
import personalDataSelectedIcon from 'static/img/track-panel/own-data-selected.svg';

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
    description: 'Track search',
    icon: {
      default: searchIcon,
      selected: searchSelectedIcon
    },
    name: 'search'
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
    description: 'Bookmarks',
    icon: {
      default: bookmarkIcon,
      selected: bookmarkSelectedIcon
    },
    name: 'bookmarks'
  },
  {
    description: 'Personal data',
    icon: {
      default: personalDataIcon,
      selected: personalDataSelectedIcon
    },
    name: 'personal-data'
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
    description: 'Downloads',
    icon: {
      default: downloadIcon,
      selected: downloadSelectedIcon
    },
    name: 'downloads'
  }
];
