import { createAction } from 'typesafe-actions';
import { Article } from 'src/content/app/help-and-docs/types/article';

export const setActiveComponentId = createAction(
  'help-and-docs/set-active-component-id'
)<string | null>();

export const togglePopup = createAction('help-and-docs/toggle-help-popup')();

export const setHelpContent = createAction('help-and-docs/set-help-content')<{
  componentId: string;
  content: Article;
}>();
