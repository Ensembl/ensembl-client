import { RootState } from 'src/store';

export const getPreFilterStatuses = (state: RootState): {} =>
  state.customDownload.preFilter.preFilterStatuses;
