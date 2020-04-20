import { Article } from 'src/content/app/help-and-docs/types/article';

// FIXME: fetchedArticles will not be necessery here if we are going to use GraphQL from Strapi
export type HelpAndDocsState = {
  activeComponentId: string | null;
  isPopupShown: boolean;
  fetchedArticles: {
    [componentId: string]: Article;
  };
};

export const initialHelpAndDocsState: HelpAndDocsState = {
  activeComponentId: null,
  isPopupShown: false,
  fetchedArticles: {}
};
