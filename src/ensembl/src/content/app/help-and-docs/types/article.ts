export type Article = {
  title: string;
  body: string;
  parentArticle?: Article;
  previousArticle?: Article;
  nextArticle?: Article;
};
