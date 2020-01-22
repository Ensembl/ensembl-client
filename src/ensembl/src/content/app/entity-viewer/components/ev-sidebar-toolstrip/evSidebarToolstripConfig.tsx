import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';
import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';

export type EVSidebarToolstripItem = {
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
};

export const evSidebarToolstripConfig: EVSidebarToolstripItem[] = [
  {
    description: 'Search',
    icon: searchIcon,
    name: 'search'
  },
  {
    description: 'Bookmarks',
    icon: bookmarkIcon,
    name: 'bookmarks'
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
