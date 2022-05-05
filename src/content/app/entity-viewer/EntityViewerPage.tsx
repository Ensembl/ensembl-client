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

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  parseFocusObjectId,
  parseFocusIdFromUrl
} from 'src/shared/helpers/focusObjectHelpers';

import { getPathParameters } from 'src/shared/hooks/useUrlParams';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import { fetchPageTitleInfo } from 'src/content/app/entity-viewer/state/pageMeta/entityViewerPageMetaSlice';
import { getEntityViewerPageMeta } from 'src/content/app/entity-viewer/state/pageMeta/entityViewerPageMetaSelectors';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import type { ServerFetch } from 'src/routes/routesConfig';

const LoadableEntityViewer = loadable(() => import('./EntityViewer'));

const EntityViewerPage = () => {
  const dispatch = useAppDispatch();
  const hasMounted = useHasMounted();
  const activeGenomeId = useAppSelector(getEntityViewerActiveGenomeId);
  const activeEntityId = useAppSelector(getEntityViewerActiveEntityId);
  const pageMeta = useAppSelector(getEntityViewerPageMeta);

  const { title } = pageMeta;

  useEffect(() => {
    const geneId = activeEntityId
      ? parseFocusObjectId(activeEntityId).objectId
      : null;
    const shouldFetchPageTitle =
      activeGenomeId !== null &&
      geneId !== null &&
      (activeGenomeId !== pageMeta.genomeId || geneId !== pageMeta.entityId);

    if (shouldFetchPageTitle) {
      dispatch(
        fetchPageTitleInfo({
          genomeId: activeGenomeId as string,
          geneStableId: geneId as string
        })
      );
    }
  }, [activeGenomeId, activeEntityId]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Entity viewer" />
      </Helmet>
      {hasMounted && <LoadableEntityViewer />}
    </>
  );
};

export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;
  const { genomeId, entityId } = getPathParameters<'genomeId' | 'entityId'>(
    '/entity-viewer/:genomeId/:entityId',
    path
  );

  if (genomeId && entityId) {
    const stableId = parseFocusIdFromUrl(entityId).objectId;
    await store.dispatch(
      fetchPageTitleInfo({
        genomeId,
        geneStableId: stableId
      })
    );

    // If the gene could not be fetched (due to incorrect ids in the request)
    // the return value from `fetchPageTitleInfo` will have the following shape:
    // `{ payload: {status: 404} }` (defined in fetchPageTitleInfo), which can be used to indicate
    // a 404 response.
    // TODO: figure out how to handle this
  }
};

export default EntityViewerPage;
