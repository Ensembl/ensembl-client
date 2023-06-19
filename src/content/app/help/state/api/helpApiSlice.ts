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

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

import config from 'config';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type {
  TextArticleData,
  VideoArticleData
} from 'src/shared/types/help-and-docs/article';
import type { Menu } from 'src/shared/types/help-and-docs/menu';

type HelpArticleResponse = TextArticleData | VideoArticleData;

type HelpArticleQueryParams = {
  pathname: string;
};

type MenuQueryParams = {
  name: string;
};

const helpApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHelpMenu: builder.query<Menu, MenuQueryParams>({
      query: (params) => ({
        url: `${config.docsBaseUrl}/menus?name=${params.name}`
      })
    }),
    getHelpArticle: builder.query<HelpArticleResponse, HelpArticleQueryParams>({
      query: (params) => ({
        url: `${config.docsBaseUrl}/article?url=${encodeURIComponent(
          params.pathname
        )}`
      })
    })
  })
});

export const { getHelpArticle } = helpApiSlice.endpoints;
export const { useGetHelpArticleQuery, useGetHelpMenuQuery } = helpApiSlice;

export const isArticleNotFoundError = (
  error?: SerializedError | FetchBaseQueryError
): boolean => {
  const hasErrorStatus = error && 'status' in error;
  if (!hasErrorStatus) {
    return false;
  }

  const errorStatus = error.status;
  return typeof errorStatus === 'number' && errorStatus === 404;
};
