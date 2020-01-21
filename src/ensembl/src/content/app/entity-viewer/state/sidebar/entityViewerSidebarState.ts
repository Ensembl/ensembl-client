export enum SidebarTabName {
  OVERVIEW = 'overview',
  PUBLICATIONS = 'publications'
}

export type EntityViewerSidebarState = Readonly<{
  activeTabName: SidebarTabName;
}>;

export const initialState: EntityViewerSidebarState = {
  activeTabName: SidebarTabName.OVERVIEW
};
