import { ActionType, getType } from 'typesafe-actions';

import { TrackPanelState, defaultTrackPanelState } from './trackPanelState';
import * as trackPanelActions from './trackPanelActions';

export default function trackPanel(
  state: TrackPanelState = defaultTrackPanelState,
  action: ActionType<typeof trackPanelActions>
): TrackPanelState {
  // check if action payload is not undefined to assign activeGenomeId
  const activeGenomeId = action.payload && action.payload.activeGenomeId;

  switch (action.type) {
    case getType(trackPanelActions.toggleTrackPanelForGenome):
      return {
        ...state,
        [activeGenomeId]: {
          ...state[activeGenomeId],
          isTrackPanelOpened: action.payload.isTrackPanelOpened
        }
      };
    case getType(trackPanelActions.toggleTrackPanelModalForGenome):
      return {
        ...state,
        [activeGenomeId]: {
          ...state[activeGenomeId],
          isTrackPanelModalOpened: action.payload.isTrackPanelModalOpened
        }
      };
    case getType(trackPanelActions.changeTrackPanelModalViewForGenome):
      return {
        ...state,
        [activeGenomeId]: {
          ...state[activeGenomeId],
          trackPanelModalView: action.payload.trackPanelModalView
        }
      };
    case getType(trackPanelActions.selectBrowserTab):
      return {
        ...state,
        [activeGenomeId]: {
          ...state[activeGenomeId],
          selectedBrowserTab: action.payload.selectedBrowserTab
        }
      };
    default:
      return state;
  }
}
