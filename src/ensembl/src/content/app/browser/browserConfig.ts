/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

import { BrowserNavAction } from 'src/content/app/browser/browserState';

export type BrowserNavItem = {
  description: string;
  detail: {
    [key: string]: number;
  };
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: BrowserNavAction;
};

export const browserNavConfig: BrowserNavItem[] = [
  {
    description: 'navigate up',
    detail: {
      move_up_px: 50
    },
    icon: navigateUpIcon,
    name: BrowserNavAction.MOVE_UP
  },
  {
    description: 'navigate down',
    detail: {
      move_down_px: 50
    },
    icon: navigateDownIcon,
    name: BrowserNavAction.MOVE_DOWN
  },
  {
    description: 'zoom out',
    detail: {
      zoom_by: -0.3
    },
    icon: zoomOutIcon,
    name: BrowserNavAction.ZOOM_OUT
  },
  {
    description: 'zoom in',
    detail: {
      zoom_by: 0.3
    },
    icon: zoomInIcon,
    name: BrowserNavAction.ZOOM_IN
  },
  {
    description: 'navigate left',
    detail: {
      move_left_px: 50
    },
    icon: navigateLeftIcon,
    name: BrowserNavAction.MOVE_LEFT
  },
  {
    description: 'navigate right',
    detail: {
      move_right_px: 50
    },
    icon: navigateRightIcon,
    name: BrowserNavAction.MOVE_RIGHT
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
