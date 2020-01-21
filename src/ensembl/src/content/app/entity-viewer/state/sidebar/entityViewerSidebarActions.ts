import { createAction } from 'typesafe-actions';

import { SidebarTabName } from './entityViewerSidebarState';

export const setSidebarTabName = createAction(
  'entity-viewer-sidebar/set-sidebar-tab-name'
)<SidebarTabName>();
