import { RootState } from 'src/store';

export const getEntityViewerSidebarTabName = (state: RootState) =>
  state.entityViewer.sidebar.activeTabName;
