import { ActionType, getType } from 'typesafe-actions';

import {
  getInitialTrackPanelState,
  getTrackPanelStateForGenome,
  TrackPanelState
} from './trackPanelState';
import * as browserActions from 'src/content/app/browser/browserActions';
import * as trackPanelActions from './trackPanelActions';

export default function trackPanel(
  state: TrackPanelState = getInitialTrackPanelState(),
  action:
    | ActionType<typeof trackPanelActions>
    | ActionType<typeof browserActions>
): TrackPanelState {
  switch (action.type) {
    case getType(browserActions.setDataFromUrl):
      const { activeGenomeId } = action.payload;
      return {
        ...state,
        [activeGenomeId]: getTrackPanelStateForGenome(activeGenomeId)
      };
    case getType(trackPanelActions.updateTrackPanelForGenome):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          ...action.payload.data
        }
      };
    default:
      return state;
  }
}
