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

import { ChromeToBrowserMessagingActions } from 'src/content/app/browser/services/browser-messaging-service/browser-message-creator';

export type BrowserNavItem = {
  description: string;
  detail: {
    [key: string]: number;
  };
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string;
  action:
    | ChromeToBrowserMessagingActions.MOVE_UP
    | ChromeToBrowserMessagingActions.MOVE_DOWN
    | ChromeToBrowserMessagingActions.MOVE_LEFT
    | ChromeToBrowserMessagingActions.MOVE_RIGHT
    | ChromeToBrowserMessagingActions.ZOOM_BY;
};

export const browserNavConfig: BrowserNavItem[] = [
  {
    description: 'navigate up',
    detail: {
      move_up_px: 50
    },
    icon: navigateUpIcon,
    name: 'navigate-up',
    action: ChromeToBrowserMessagingActions.MOVE_UP
  },
  {
    description: 'navigate down',
    detail: {
      move_down_px: 50
    },
    icon: navigateDownIcon,
    name: 'navigate-down',
    action: ChromeToBrowserMessagingActions.MOVE_DOWN
  },
  {
    description: 'zoom out',
    detail: {
      zoom_by: -0.3
    },
    icon: zoomOutIcon,
    name: 'zoom-out',
    action: ChromeToBrowserMessagingActions.ZOOM_BY
  },
  {
    description: 'zoom in',
    detail: {
      zoom_by: 0.3
    },
    icon: zoomInIcon,
    name: 'zoom-in',
    action: ChromeToBrowserMessagingActions.ZOOM_BY
  },
  {
    description: 'navigate left',
    detail: {
      move_left_px: 50
    },
    icon: navigateLeftIcon,
    name: 'navigate-left',
    action: ChromeToBrowserMessagingActions.MOVE_LEFT
  },
  {
    description: 'navigate right',
    detail: {
      move_right_px: 50
    },
    icon: navigateRightIcon,
    name: 'navigate-right',
    action: ChromeToBrowserMessagingActions.MOVE_RIGHT
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
