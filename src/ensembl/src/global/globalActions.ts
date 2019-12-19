import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { BreakpointWidth } from './globalConfig';
import { getBreakpointWidth } from './globalSelectors';

import { RootState } from 'src/store';

export const setBreakpointWidth = createAction(
  'browser/update-breakpoint-width'
)<BreakpointWidth>();

export const updateBreakpointWidth: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (viewportWidth: BreakpointWidth) => async (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const currentBreakpointWidth = getBreakpointWidth(state);

  if (viewportWidth !== currentBreakpointWidth) {
    dispatch(setBreakpointWidth(viewportWidth));
  }
};
