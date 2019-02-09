import { createAction } from 'typesafe-actions';
import { WidthType } from './globalState';

export const updateGlobalWidth = createAction(
  'browser/update-global-width',
  (resolve) => {
    return (globalWidth: WidthType) => resolve(globalWidth);
  }
);
