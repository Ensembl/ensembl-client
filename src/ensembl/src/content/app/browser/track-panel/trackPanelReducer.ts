import { ActionType, getType } from 'typesafe-actions';

import { TrackPanelState, defaultTrackPanelState } from './trackPanelState';
import * as trackPanelActions from './trackPanelActions';

export default function trackPanel(
  state: TrackPanelState = defaultTrackPanelState,
  action: ActionType<typeof trackPanelActions>
): TrackPanelState {
  switch (action.type) {
    case getType(trackPanelActions.toggleTrackPanel):
      const isTrackPanelOpened =
        action.payload === undefined
          ? !state.isTrackPanelOpened
          : action.payload;

      return {
        ...state,
        isTrackPanelOpened
      };
    case getType(trackPanelActions.openTrackPanelModal):
      return {
        ...state,
        isTrackPanelModalOpened: true,
        trackPanelModalView: action.payload
      };
    case getType(trackPanelActions.closeTrackPanelModal):
      return {
        ...state,
        isTrackPanelModalOpened: false,
        trackPanelModalView: ''
      };
    case getType(trackPanelActions.selectBrowserTab):
      return {
        ...state,
        selectedBrowserTab: Object.assign(
          {},
          state.selectedBrowserTab,
          action.payload
        ),
        isTrackPanelModalOpened: false,
        trackPanelModalView: ''
      };
    default:
      return state;
  }
}
