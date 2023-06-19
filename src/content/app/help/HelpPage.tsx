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

import React from 'react';

import useHasMounted from 'src/shared/hooks/useHasMounted';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';
import {
  getHelpArticle,
  isArticleNotFoundError
} from 'src/content/app/help/state/api/helpApiSlice';

import { createHelpPageMeta } from './helpers/helpPageMetaHelpers';
import { isHelpIndexRoute } from './helpers/isHelpIndexRoute';

import type { ServerFetch } from 'src/routes/routesConfig';

const LazilyLoadedHelp = React.lazy(() => import('./Help'));

const HelpPage = () => {
  const hasMounted = useHasMounted();

  return hasMounted ? <LazilyLoadedHelp /> : null;
};

export default HelpPage;

export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;

  if (isHelpIndexRoute(path)) {
    store.dispatch(updatePageMeta(createHelpPageMeta({ path })));
    return;
  }

  const articlePromise = store.dispatch(
    getHelpArticle.initiate({ pathname: path })
  );

  const { data: article, error: articleError } = await articlePromise;

  if (isArticleNotFoundError(articleError)) {
    return {
      status: 404
    };
  }

  store.dispatch(updatePageMeta(createHelpPageMeta({ article, path })));
};
