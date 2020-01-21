export enum SidebarTabName {
  OVERVIEW = 'overview',
  PUBLICATIONS = 'publications'
}

export type EntityViewerSidebarState = {
  [genomeId: string]: EntityViewerSidebarStateForGenome;
};

export type EntityViewerSidebarStateForGenome = Readonly<{
  isOpen: boolean;
  activeTabName: SidebarTabName;
}>;

export const buildInitialStateForGenome = (
  genomeId: string
): EntityViewerSidebarState => ({
  [genomeId]: {
    isOpen: true,
    activeTabName: SidebarTabName.OVERVIEW
  }
});

export const initialState: EntityViewerSidebarState = {};
