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

import { buildPageMeta } from './shared/page-meta/buildPageMeta';

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';
import {
  useGenePageMetaQuery,
  useVariantPageMetaQuery
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import EntityViewerIdsContextProvider from 'src/content/app/entity-viewer/contexts/entity-viewer-ids-context/EntityViewerIdsContextProvider';

export { serverFetch } from 'src/content/app/entity-viewer/shared/server-fetch/entityViewerServerFetch';

const LazilyLoadedEntityViewer = React.lazy(() => import('./EntityViewer'));

const EntityViewerPage = () => {
  const hasMounted = useHasMounted();

  useEntityViewerPageMeta();

  return hasMounted ? <LazilyLoadedEntityViewer /> : null;
};

const useEntityViewerPageMeta = () => {
  const dispatch = useAppDispatch();
  const { activeGenomeId, parsedEntityId } = useEntityViewerIds();
  const { type: entityType, objectId: entityId } = parsedEntityId ?? {};

  const { currentData: genePageMeta, isLoading: isGenePageMetaLoading } =
    useGenePageMetaQuery(
      {
        genomeId: activeGenomeId ?? '',
        geneId: entityId ?? ''
      },
      {
        skip: entityType !== 'gene' || !activeGenomeId || !entityId
      }
    );

  const { currentData: variantPageMeta, isLoading: isVariantPageMetaLoading } =
    useVariantPageMetaQuery(
      {
        genomeId: activeGenomeId ?? '',
        variantId: entityId ?? ''
      },
      {
        skip: entityType !== 'variant' || !activeGenomeId || !entityId
      }
    );

  const pageMeta = genePageMeta || variantPageMeta;
  const isLoading = isGenePageMetaLoading || isVariantPageMetaLoading;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const preparedPageMeta = entityId
      ? buildPageMeta({
          title: pageMeta?.title
        })
      : buildPageMeta();

    dispatch(updatePageMeta(preparedPageMeta));
  }, [isLoading]);
};

const WrappedEntityViewerPage = () => {
  return (
    <EntityViewerIdsContextProvider>
      <EntityViewerPage />
    </EntityViewerIdsContextProvider>
  );
};

export default WrappedEntityViewerPage;
