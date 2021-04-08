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
  related_articles: RelatedArticle[];
};

export type TextArticle = Article & {
  type: 'article';
  body: string; // the actual html of the article
};

export type VideoArticle = Article & {
  type: 'video';
  youtube_id: string;
};

export type RelatedArticle = {
  title: string;
  slug: string;
  url: string;
  type: ArticleType;
};

export type SlugReference = {
  slug: string; // slug of the help article, e.g. "selecting-a-species"
};

export type UrlReference = {
  url: string; // url of the article
};
