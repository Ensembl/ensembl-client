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

import { useAppDispatch } from 'src/store';

import { parseFocusIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';

import useGeneViewIds from 'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds';
import { getPathParameters } from 'src/shared/hooks/useUrlParams';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import {
  fetchGenomeInfo,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';
import {
  useGenePageMetaQuery,
  fetchGenePageMeta
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import EntityViewerIdsContextProvider from 'src/content/app/entity-viewer/contexts/entity-viewer-ids-context/EntityViewerIdsContextProvider';

import type { ServerFetch } from 'src/routes/routesConfig';
import type { AppDispatch } from 'src/store';

const LazilyLoadedEntityViewer = React.lazy(() => import('./EntityViewer'));

const defaultPageTitle = 'Entity viewer — Ensembl';

const EntityViewerPage = () => {
  const hasMounted = useHasMounted();
  const dispatch = useAppDispatch();

  // TODO: eventually, EntityViewerPage should not use a hook that is explicitly about gene,
  // because we will have entities other than gene
  const { genomeId, geneId, entityId } = useGeneViewIds();

  const { data: pageMeta, isLoading } = useGenePageMetaQuery(
    {
      genomeId: genomeId ?? '',
      geneId: geneId ?? ''
    },
    {
      skip: !genomeId || !geneId
    }
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const preparedPageMeta = entityId
      ? buildPageMeta({
          title: pageMeta?.title ?? defaultPageTitle
        })
      : buildPageMeta();

    dispatch(updatePageMeta(preparedPageMeta));
  }, [isLoading]);

  return hasMounted ? <LazilyLoadedEntityViewer /> : null;
};

export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;
  const dispatch: AppDispatch = store.dispatch;
  const { genomeId: genomeIdFromUrl, entityId } = getPathParameters<
    'genomeId' | 'entityId'
  >(['/entity-viewer/:genomeId', '/entity-viewer/:genomeId/:entityId'], path);

  // If the url is just /entity-viewer, update page meta and exit
  if (!genomeIdFromUrl) {
    dispatch(updatePageMeta(buildPageMeta()));
    return;
  }

  const genomeInfoResponsePromise = dispatch(
    fetchGenomeInfo.initiate(genomeIdFromUrl)
  );
  const { data: genomeInfoData, error: genomeInfoError } =
    await genomeInfoResponsePromise;

  if (isGenomeNotFoundError(genomeInfoError)) {
    return {
      status: 404
    };
  }

  const genomeId = genomeInfoData?.genomeId as string; // by this point, genomeId clearly exists

  // If the url is just /entity-viewer/:genomeId, update page meta and exit
  if (!entityId) {
    dispatch(updatePageMeta(buildPageMeta()));
    return;
  }

  // NOTE: we will have to be smarter here when entities are no longer just genes
  let geneStableId;

  try {
    geneStableId = parseFocusIdFromUrl(entityId).objectId;
  } catch {
    // something wrong with the entity id
    return {
      status: 404
    };
  }

  const pageMetaPromise = dispatch(
    fetchGenePageMeta.initiate({
      genomeId,
      geneId: geneStableId
    })
  );
  const pageMetaQueryResult = await pageMetaPromise;

  if ((pageMetaQueryResult?.error as any)?.meta?.data?.gene === null) {
    // this is graphql's way of telling us that there is no such gene
    return {
      status: 404
    };
  } else {
    const title = pageMetaQueryResult.data?.title ?? '';
    dispatch(
      updatePageMeta(
        buildPageMeta({
          title
        })
      )
    );
  }
};

const buildPageMeta = (
  params: {
    title?: string;
    description?: string;
  } = {}
) => {
  // TODO: eventually, decide on page description
  const { title = defaultPageTitle, description = '' } = params;
  return {
    title,
    description
  };
};

const WrappedEntityViewerPage = () => {
  return (
    <EntityViewerIdsContextProvider>
      <EntityViewerPage />
    </EntityViewerIdsContextProvider>
  );
};

export default WrappedEntityViewerPage;
