import { Status } from 'src/shared/types/status';

export enum SidebarTabName {
  OVERVIEW = 'Overview',
  EXTERNAL_REFERENCES = 'External references'
}

export type SidebarStatus = Status.OPEN | Status.CLOSED;

export type EntityViewerSidebarState = Readonly<{
  [genomeId: string]: EntityViewerSidebarStateForGenome;
}>;

export type EntityViewerSidebarStateForGenome = Readonly<{
  status: SidebarStatus;
  activeTabName: SidebarTabName;
}>;

export const buildInitialStateForGenome = (
  genomeId: string
): EntityViewerSidebarState => ({
  [genomeId]: {
    status: Status.OPEN,
    activeTabName: SidebarTabName.OVERVIEW
  }
});

export const initialState: EntityViewerSidebarState = {};
