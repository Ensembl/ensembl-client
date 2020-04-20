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
    // // FIXME: This case will not be required if we use GraphQL
    case getType(actions.setHelpContent):
      return {
        ...state,
        fetchedContents: {
          ...state.fetchedArticles,
          [action.payload.componentId]: action.payload.content
        }
      };
    default:
      return state;
  }
}
