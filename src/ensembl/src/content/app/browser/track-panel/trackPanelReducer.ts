import { ActionType, getType } from 'typesafe-actions';

import { TrackPanelState, defaultTrackPanelState } from './trackPanelState';
import * as trackPanelActions from './trackPanelActions';

export default function trackPanel(
  state: TrackPanelState = defaultTrackPanelState,
  action: ActionType<typeof trackPanelActions>
): TrackPanelState {
  switch (action.type) {
    case getType(trackPanelActions.toggleTrackPanelForGenome):
      return {
        ...state,
        isTrackPanelOpened: { ...state.isTrackPanelOpened, ...action.payload }
      };
    case getType(trackPanelActions.toggleTrackPanelModalForGenome):
      return {
        ...state,
        isTrackPanelModalOpened: {
          ...state.isTrackPanelModalOpened,
          ...action.payload
        }
      };
    case getType(trackPanelActions.changeTrackPanelModalViewForGenome):
      return {
        ...state,
        trackPanelModalView: { ...state.trackPanelModalView, ...action.payload }
      };
    case getType(trackPanelActions.selectBrowserTab):
      return {
        ...state,
        selectedBrowserTab: { ...state.selectedBrowserTab, ...action.payload }
      };
    default:
      return state;
  }
}
