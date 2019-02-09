import { RootState } from './rootReducer';
import { WidthType } from './globalState';

export const getGlobalWidth = (state: RootState): WidthType =>
  state.global.globalWidth;
