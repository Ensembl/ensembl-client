/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type ArticleType = 'article' | 'video';

export type Article = {
  slug: string; // an article identtifier
  url: string;
  title: string; // part of article metadata; for use in the page meta tag
  description: string; // part of article metadata; for use in the page meta tag
};

// IndexArticle is where the article metaphor wears a bit thin.
// It only contains references to other, proper articles.
// Its purpose is to be displayed on an index page, such as /help  
export type IndexArticle = Article & {
  items: IndexArticleItem[];
};

export type TextArticle = Article & {
  type: 'article';
  related_articles: RelatedArticle[];
  body: string; // the actual html of the article
};

export type VideoArticle = Article & {
  type: 'video';
  related_articles: RelatedArticle[];
  youtube_id: string;
};

export type RelatedArticle = {
  title: string;
  slug: string;
  url: string;
  type: ArticleType;
};

export type IndexArticleItem = {
  title: string;
  summary: string;
  url: string;
};
