import { HelpContent } from '../types/help-content';

export type HelpAndDocsState = {
  activeComponentId: string | null;
  isPopupShown: boolean;
  fetchedContents: {
    [componentId: string]: HelpContent;
  };
};

export const initialHelpAndDocsState: HelpAndDocsState = {
  activeComponentId: 'app-species-selector',
  isPopupShown: false,
  fetchedContents: {}
};
