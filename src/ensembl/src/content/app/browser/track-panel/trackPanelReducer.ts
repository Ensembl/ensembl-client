import { ActionType, getType } from 'typesafe-actions';

import { TrackPanelState, defaultTrackPanelState } from './trackPanelState';
import * as trackPanelActions from './trackPanelActions';

export default function trackPanel(
  state: TrackPanelState = defaultTrackPanelState,
  action: ActionType<typeof trackPanelActions>
): TrackPanelState {
  switch (action.type) {
    case getType(trackPanelActions.updateTrackPanelForGenome):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...action.payload.data
        }
      };
    case getType(trackPanelActions.setHighlightedTrack):
      return {
        ...state,
        highlightedTrack: action.payload
      };
    default:
      return state;
  }
}
