import { RootState } from 'src/store';

export const getSelectedPreFilters = (state: RootState): boolean =>
  state.customDownload.preFilter.selectedPreFilters;
