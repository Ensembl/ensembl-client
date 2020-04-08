import { ActionType, getType } from 'typesafe-actions';

import { initialHelpAndDocsState, HelpAndDocsState } from './helpAndDocsState';

import * as actions from './helpAndDocsActions';

export default function helpAndDocsReducer(
  state: HelpAndDocsState = initialHelpAndDocsState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.setActiveComponentId):
      return {
        ...state,
        activeComponentId: action.payload
      };
    case getType(actions.togglePopup):
      return {
        ...state,
        isPopupShown: !state.isPopupShown
      };
    case getType(actions.setHelpContent):
      return {
        ...state,
        fetchedContents: {
          ...state.fetchedContents,
          [action.payload.componentId]: action.payload.content
        }
      };
    default:
      return state;
  }
}
