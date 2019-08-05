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
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          isTrackPanelOpened: action.payload.isTrackPanelOpened
        }
      };
    case getType(trackPanelActions.toggleTrackPanelModalForGenome):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          isTrackPanelModalOpened: action.payload.isTrackPanelModalOpened
        }
      };
    case getType(trackPanelActions.changeTrackPanelModalViewForGenome):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          trackPanelModalView: action.payload.trackPanelModalView
        }
      };
    case getType(trackPanelActions.selectBrowserTab):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          selectedBrowserTab: action.payload.selectedBrowserTab
        }
      };
    default:
      return state;
  }
}
