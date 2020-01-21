import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';
import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as personalDataIcon } from 'static/img/sidebar/own-data.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as tracksManagerIcon } from 'static/img/sidebar/tracks-manager.svg';

export type TrackPanelBarItem = {
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
};

export const trackPanelBarConfig: TrackPanelBarItem[] = [
  {
    description: 'Track search',
    icon: searchIcon,
    name: 'search'
  },
  {
    description: 'Tracks manager',
    icon: tracksManagerIcon,
    name: 'tracks-manager'
  },
  {
    description: 'Bookmarks',
    icon: bookmarkIcon,
    name: 'bookmarks'
  },
  {
    description: 'Personal data',
    icon: personalDataIcon,
    name: 'personal-data'
  },
  {
    description: 'Share',
    icon: shareIcon,
    name: 'share'
  },
  {
    description: 'Downloads',
    icon: downloadIcon,
    name: 'downloads'
  }
];
