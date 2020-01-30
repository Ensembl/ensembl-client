import { RootState } from 'src/store';

export const getEntityViewerActiveGenomeId = (state: RootState) =>
  state.entityViewer.general.activeGenomeId;
