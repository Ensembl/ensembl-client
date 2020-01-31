import { ReactComponent as zoomInIcon } from 'static/img/browser/zoom-in.svg';
import { ReactComponent as zoomOutIcon } from 'static/img/browser/zoom-out.svg';
import { ReactComponent as navigateUpIcon } from 'static/img/browser/navigate-up.svg';
import { ReactComponent as navigateDownIcon } from 'static/img/browser/navigate-down.svg';
import { ReactComponent as navigateLeftIcon } from 'static/img/browser/navigate-left.svg';
import { ReactComponent as navigateRightIcon } from 'static/img/browser/navigate-right.svg';
import { ReactComponent as trackHeightIcon } from 'static/img/browser/icon_tracks_height.svg';
import { ReactComponent as trackLockIcon } from 'static/img/browser/icon_tracks_lock_open.svg';
import { ReactComponent as trackHighlightIcon } from 'static/img/browser/icon_tracks_highlight.svg';
import { ReactComponent as trackMoveIcon } from 'static/img/browser/icon_tracks_move.svg';

export type BrowserNavItem = {
  description: string;
  detail: {
    [key: string]: number;
  };
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
};

export const browserNavConfig: BrowserNavItem[] = [
  {
    description: 'navigate up',
    detail: {
      move_up_px: 50
    },
    icon: navigateUpIcon,
    name: 'navigate-up'
  },
  {
    description: 'navigate down',
    detail: {
      move_down_px: 50
    },
    icon: navigateDownIcon,
    name: 'navigate-down'
  },
  {
    description: 'zoom out',
    detail: {
      zoom_by: -0.3
    },
    icon: zoomOutIcon,
    name: 'zoom-out'
  },
  {
    description: 'zoom in',
    detail: {
      zoom_by: 0.3
    },
    icon: zoomInIcon,
    name: 'zoom-in'
  },
  {
    description: 'navigate left',
    detail: {
      move_left_px: 50
    },
    icon: navigateLeftIcon,
    name: 'navigate-left'
  },
  {
    description: 'navigate right',
    detail: {
      move_right_px: 50
    },
    icon: navigateRightIcon,
    name: 'navigate-right'
  }
];

export const browserTrackConfig = {
  trackHeightIcon: {
    description: 'Change track height',
    icon: trackHeightIcon
  },
  trackLockIcon: {
    description: 'Lock track',
    icon: trackLockIcon
  },
  trackHighlightIcon: {
    description: 'Highlight track',
    icon: trackHighlightIcon
  },
  trackMoveIcon: {
    description: 'Move track',
    icon: trackMoveIcon
  }
};
