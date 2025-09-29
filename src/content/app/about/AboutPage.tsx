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

import { lazy } from 'react';

import useHasMounted from 'src/shared/hooks/useHasMounted';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';
import { getHelpArticle } from 'src/content/app/help/state/api/helpApiSlice';
import { isMissingResourceError } from 'src/shared/state/api-slices/restSlice';

import {
  createAboutPageTitle,
  ABOUT_PAGE_FALLBACK_DESCRIPTION
} from './helpers/aboutPageMetaHelpers';

import type { ServerFetch } from 'src/routes/routesConfig';
import type { AppDispatch } from 'src/store';

const LazilyLoadedAbout = lazy(() => import('./About'));

const AboutPage = () => {
  const hasMounted = useHasMounted();

  return hasMounted ? <LazilyLoadedAbout /> : null;
};

export default AboutPage;

export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;
  const dispatch: AppDispatch = store.dispatch;

  const articlePromise = dispatch(getHelpArticle.initiate({ pathname: path }));

  const { data: article, error: articleError } = await articlePromise;
  articlePromise.unsubscribe();

  if (isMissingResourceError(articleError)) {
    return {
      status: 404
    };
  }

  dispatch(
    updatePageMeta({
      title: createAboutPageTitle(article!.title),
      description: article!.description || ABOUT_PAGE_FALLBACK_DESCRIPTION
    })
  );
};
