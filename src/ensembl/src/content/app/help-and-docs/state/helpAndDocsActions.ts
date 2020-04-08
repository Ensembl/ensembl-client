import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import helpService from 'src/services/help-service.ts';

import { getFetchedContents } from './helpAndDocsSelectors';

import { RootState } from 'src/store';
import { HelpContent } from 'src/content/app/help-and-docs/types/help-content';

export const setActiveComponentId = createAction(
  'help-and-docs/set-active-component-id'
)<string>();

export const togglePopup = createAction('help-and-docs/toggle-help-popup')();

export const setHelpContent = createAction('help-and-docs/set-help-content')<{
  componentId: string;
  content: HelpContent;
}>();

export const fetchHelpContent: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (componentId: string) => async (dispatch, getState: () => RootState) => {
  // Check if the content already exists for this ID
  if (getFetchedContents(getState())[componentId]) {
    return;
  }

  // Lets retrieve it
  const content = await helpService.getContentsByComponentId(componentId);

  if (!content) {
    return;
  }

  dispatch(
    setHelpContent({
      componentId,
      content
    })
  );
};
