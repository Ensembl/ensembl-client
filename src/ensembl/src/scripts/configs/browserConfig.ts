import resetIcon from 'assets/img/browser/reset.svg';

import navigatorIcon from 'assets/img/browser/navigator.svg';
import navigatorSelectedIcon from 'assets/img/browser/navigator-selected.svg';

import navigateUpIcon from 'assets/img/browser/navigate-up.svg';
import navigateUpOffIcon from 'assets/img/browser/navigate-up-off.svg';

import zoomOutIcon from 'assets/img/browser/zoom-out.svg';
import zoomOutOffIcon from 'assets/img/browser/zoom-out-off.svg';

import zoomInIcon from 'assets/img/browser/zoom-in.svg';
import zoomInOffIcon from 'assets/img/browser/zoom-in-off.svg';

import navigateDownIcon from 'assets/img/browser/navigate-down.svg';
import navigateDownOffIcon from 'assets/img/browser/navigate-down-off.svg';

import navigateLeftIcon from 'assets/img/browser/navigate-left.svg';
import navigateLeftOffIcon from 'assets/img/browser/navigate-left-off.svg';

import navigateRightIcon from 'assets/img/browser/navigate-right.svg';
import navigateRightOffIcon from 'assets/img/browser/navigate-right-off.svg';

export type BrowserInfoItem = {
  description: string;
  icon: {
    default: string;
    selected: string;
  };
  name: string;
};

export type BrowserInfoType = {
  [key: string]: BrowserInfoItem;
};

export type BrowserNavItem = {
  description: string;
  detail: {
    [key: string]: number;
  };
  icon: {
    on: string;
    off: string;
  };
  name: string;
};

export const browserInfoConfig: BrowserInfoType = {
  navigator: {
    description: 'toggle browser navigation',
    icon: {
      default: navigatorIcon,
      selected: navigatorSelectedIcon
    },
    name: 'navigator'
  },
  reset: {
    description: 'reset browser image',
    icon: {
      default: resetIcon,
      selected: resetIcon
    },
    name: 'reset'
  }
};

export const browserNavConfig: BrowserNavItem[] = [
  {
    description: 'navigate up',
    detail: {
      move_up_px: 50
    },
    icon: {
      off: navigateUpOffIcon,
      on: navigateUpIcon
    },
    name: 'navigate-up'
  },
  {
    description: 'navigate down',
    detail: {
      move_down_px: 50
    },
    icon: {
      off: navigateDownOffIcon,
      on: navigateDownIcon
    },
    name: 'navigate-down'
  },
  {
    description: 'zoom out',
    detail: {
      zoom_by: -0.3
    },
    icon: {
      off: zoomOutOffIcon,
      on: zoomOutIcon
    },
    name: 'zoom-out'
  },
  {
    description: 'zoom in',
    detail: {
      zoom_by: 0.3
    },
    icon: {
      off: zoomInOffIcon,
      on: zoomInIcon
    },
    name: 'zoom-in'
  },
  {
    description: 'navigate left',
    detail: {
      move_left_px: 50
    },
    icon: {
      off: navigateLeftOffIcon,
      on: navigateLeftIcon
    },
    name: 'navigate left'
  },
  {
    description: 'navigate right',
    detail: {
      move_right_px: 50
    },
    icon: {
      off: navigateRightOffIcon,
      on: navigateRightIcon
    },
    name: 'navigate right'
  }
];
