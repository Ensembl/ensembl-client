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
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';

import {
  parseFocusIdFromUrl
} from 'src/shared/helpers/focusObjectHelpers';

import useGeneViewIds from 'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds';
import { getPathParameters } from 'src/shared/hooks/useUrlParams';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import { fetchGenomeInfo } from 'src/shared/state/genome/genomeApiSlice';
import { useGenePageMetaQuery, fetchGenePageMeta } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import type { ServerFetch } from 'src/routes/routesConfig';
import type { AppDispatch } from 'src/store';

const LoadableEntityViewer = loadable(() => import('./EntityViewer'));

const EntityViewerPage = () => {
  const hasMounted = useHasMounted();

  // TODO: eventually, EntityViewerPage should not use a hook that is explicitly about gene,
  // because we will have entities other than gene
  const { genomeId, geneId } = useGeneViewIds();

  const { data: pageMeta } = useGenePageMetaQuery({
    genomeId: genomeId ?? '',
    geneId: geneId ?? ''
  },
  {
    skip: !genomeId || !geneId
  });

  return (
    <>
      <Helmet>
        <title>{ pageMeta?.title }</title>
        <meta name="description" content="Entity viewer" />
      </Helmet>
      {hasMounted && <LoadableEntityViewer />}
    </>
  );
};


export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;
  const dispatch: AppDispatch = store.dispatch;
  const { genomeId: genomeIdFromUrl, entityId } = getPathParameters<
    'genomeId' | 'entityId'
  >('/entity-viewer/:genomeId/:entityId', path);

  if (!(genomeIdFromUrl && entityId)) {
    return;
  }

  const genomeInfoResponsePromise = dispatch(
    fetchGenomeInfo.initiate(genomeIdFromUrl)
  );
  const { data: genomeInfoData, error: genomeInfoError } = await genomeInfoResponsePromise;

  // FIXME: 404 status code in response
  if (genomeInfoError && 'status' in genomeInfoError && genomeInfoError.status >= 400) {
    return {
      status: 404
    };
  }

  const genomeId = genomeInfoData?.genomeId;

  if (!genomeId) {
    return; // this shouldn't happen
  }

  // FIXME: gene symbol parsing can explode!
  const geneStableId = parseFocusIdFromUrl(entityId).objectId;

  const pageMetaPromise = dispatch(fetchGenePageMeta.initiate({
    genomeId,
    geneId: geneStableId
  }));
  const pageMetaQueryResult = await pageMetaPromise;

  if ((pageMetaQueryResult?.error as any)?.meta?.data?.gene === null) {
    // this is graphql's way of telling us that there is no such gene
    return {
      status: 404
    };
  }

};

export default EntityViewerPage;
