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

import { isHelpIndexRoute } from './isHelpIndexRoute';

import {
  TextArticleData,
  VideoArticleData
} from 'src/shared/types/help-and-docs/article';

type Article = TextArticleData | VideoArticleData;

const postfix = 'Help and documentation — Ensembl';

export const HELP_PAGE_FALLBACK_DESCRIPTION = 'Ensembl help and documentation';

export const createHelpPageTitle = (title?: string) => {
  if (!title) {
    return postfix;
  }

  return `${title} — ${postfix}`;
};

export const createHelpPageMeta = (params: {
  article?: Article;
  path: string;
}) => {
  const { article, path } = params;

  const useFallbacks = !article || isHelpIndexRoute(path);

  const pageTitle = useFallbacks ? postfix : createHelpPageTitle(article.title);

  const pageDescription =
    useFallbacks || !article.description
      ? HELP_PAGE_FALLBACK_DESCRIPTION
      : article.description;

  return {
    title: pageTitle,
    description: pageDescription
  };
};
