import navigatorIcon from 'static/img/browser/navigator.svg';
import navigatorSelectedIcon from 'static/img/browser/navigator-selected.svg';
import navigatorGreyIcon from 'static/img/browser/navigator-grey.svg';

import navigateUpIcon from 'static/img/browser/navigate-up.svg';
import navigateUpOffIcon from 'static/img/browser/navigate-up-off.svg';

import zoomOutIcon from 'static/img/browser/zoom-out.svg';
import zoomOutOffIcon from 'static/img/browser/zoom-out-off.svg';

import zoomInIcon from 'static/img/browser/zoom-in.svg';
import zoomInOffIcon from 'static/img/browser/zoom-in-off.svg';

import navigateDownIcon from 'static/img/browser/navigate-down.svg';
import navigateDownOffIcon from 'static/img/browser/navigate-down-off.svg';

import navigateLeftIcon from 'static/img/browser/navigate-left.svg';
import navigateLeftOffIcon from 'static/img/browser/navigate-left-off.svg';

import navigateRightIcon from 'static/img/browser/navigate-right.svg';
import navigateRightOffIcon from 'static/img/browser/navigate-right-off.svg';

export type BrowserInfoItem = {
  description: string;
  icon: {
    default: string;
    grey?: string;
    selected?: string;
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
      grey: navigatorGreyIcon,
      selected: navigatorSelectedIcon
    },
    name: 'navigator'
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

export const chrOptions: string[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  'X',
  'Y',
  'MT'
];
