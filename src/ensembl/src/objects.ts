import { RefObject, ReactEventHandler } from 'react';

import * as headerActions from './header/headerActions';
import * as browserActions from './content/app/browser/browserActions';
import * as customDownloadActions from './content/app/custom-download/customDownloadActions';
import * as drawerActions from './content/app/browser/drawer/drawerActions';
import * as trackPanelActions from './content/app/browser/track-panel/trackPanelActions';

export type ReactRefs = {
  [key: string]: RefObject<HTMLElement>;
};

export type EventHandlers = {
  [key: string]: ReactEventHandler;
};

export type RootAction =
  | typeof headerActions
  | typeof browserActions
  | typeof drawerActions
  | typeof customDownloadActions
  | typeof trackPanelActions;
