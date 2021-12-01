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

import useApiService from 'src/shared/hooks/useApiService';

import { SlugReference } from './types';
import {
  TextArticleData,
  VideoArticleData
} from 'src/shared/types/help-and-docs/article';

const getQuery = (reference: SlugReference) => {
  return `slug=${reference.slug}`;
};

export type ArticleData = TextArticleData | VideoArticleData;

const useHelpArticle = (reference: SlugReference) => {
  const query = getQuery(reference);
  const url = `/api/docs/article?${query}`;

  const { data: article, loadingState } = useApiService<ArticleData>({
    endpoint: url
  });

  return {
    loadingState,
    article
  };
};

export default useHelpArticle;
