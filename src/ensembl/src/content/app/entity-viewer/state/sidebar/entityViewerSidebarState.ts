import { Status } from 'src/shared/types/status';

export enum SidebarTabName {
  OVERVIEW = 'overview',
  PUBLICATIONS = 'publications'
}

export type SidebarStatus = Status.OPEN | Status.CLOSED;

export type EntityViewerSidebarState = Readonly<{
  [genomeId: string]: EntityViewerSidebarStateForGenome;
}>;

export type EntityViewerSidebarStateForGenome = Readonly<{
  status: SidebarStatus;
  selectedTabName: SidebarTabName;
}>;

export const buildInitialStateForGenome = (
  genomeId: string
): EntityViewerSidebarState => ({
  [genomeId]: {
    status: Status.OPEN,
    selectedTabName: SidebarTabName.OVERVIEW
  }
});

export const initialState: EntityViewerSidebarState = {};
