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

import { useEffect, use, lazy } from 'react';
import { browser } from 'react-dom';

import { useAppDispatch } from 'src/store';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';

import type { ServerFetch } from 'src/routes/routesConfig';

const LazilyLoadedSequenceViewerViewer = lazy(() => import('./SequenceViewer'));

const pageTitle = 'Sequence Viewer — Ensembl';
const pageDescription =
  'View sequences of genomic features or genomic locations';

const SequenceViewerPage = () => {
  use(browser());
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updatePageMeta({
        title: pageTitle,
        description: pageDescription
      })
    );
  }, [dispatch]);

  return <LazilyLoadedSequenceViewerViewer />;
};

export default SequenceViewerPage;

export const serverFetch: ServerFetch = async (params) => {
  params.store.dispatch(
    updatePageMeta({
      title: pageTitle,
      description: pageDescription
    })
  );
};
