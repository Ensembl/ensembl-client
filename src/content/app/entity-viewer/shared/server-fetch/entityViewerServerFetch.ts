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

import { getPathParameters } from 'src/shared/hooks/useUrlParams';

import { parseFocusIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';

import {
  fetchGenomeSummary,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';
import {
  fetchGenePageMeta,
  fetchVariantPageMeta
} from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import { buildPageMeta } from '../page-meta/buildPageMeta';

import type { ServerFetch } from 'src/routes/routesConfig';
import type { AppDispatch } from 'src/store';

class NotFoundError extends Error {}

/**
 * The purpose of this function is to:
 * - Check that url parts resolve to existing genome id and entity; make the server respond with a 404 error if not.
 * - Fetch summary data about the feature that can then be exposed as page metadata
 */
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

  try {
    const genomeId = await fetchGenomeData({
      dispatch,
      genomeId: genomeIdFromUrl
    });

    if (!entityId) {
      dispatch(updatePageMeta(buildPageMeta()));
      return;
    }

    await fetchEntityData({ genomeId, entityId, dispatch });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        status: 404
      };
    } else {
      throw new Error(); // viewRouter will pick this up and return a response with a 500 http status code
    }
  }
};

// the first and, sadly, unavoidable check: need to make sure that genome with given id exists
const fetchGenomeData = async ({
  genomeId,
  dispatch
}: {
  genomeId: string;
  dispatch: AppDispatch;
}) => {
  const genomeInfoResponsePromise = dispatch(
    fetchGenomeSummary.initiate(genomeId)
  );
  const { data: genomeInfoData, error: genomeInfoError } =
    await genomeInfoResponsePromise;

  if (isGenomeNotFoundError(genomeInfoError)) {
    throw new NotFoundError();
  }

  return genomeInfoData?.genome_id as string; // by this point, genomeId clearly exists
};

const fetchEntityData = async (params: {
  genomeId: string;
  entityId: string;
  dispatch: AppDispatch;
}) => {
  const { entityId } = params;

  let parsedEntityId;

  try {
    parsedEntityId = parseFocusIdFromUrl(entityId);
  } catch {
    throw new NotFoundError();
  }

  if (parsedEntityId.type === 'gene') {
    return await fetchGeneData({ ...params, geneId: parsedEntityId.objectId });
  } else if (parsedEntityId.type === 'variant') {
    return await fetchVariantData({
      ...params,
      variantId: parsedEntityId.objectId
    });
  } else {
    throw new NotFoundError();
  }
};

const fetchGeneData = async ({
  genomeId,
  geneId,
  dispatch
}: {
  genomeId: string;
  geneId: string;
  dispatch: AppDispatch;
}) => {
  const pageMetaPromise = dispatch(
    fetchGenePageMeta.initiate({
      genomeId,
      geneId
    })
  );
  const pageMetaQueryResult = await pageMetaPromise;
  pageMetaPromise.unsubscribe();

  if (pageMetaQueryResult?.error) {
    if ((pageMetaQueryResult.error as any)?.meta?.data?.gene === null) {
      // this is graphql's way of telling us that there is no such gene
      throw new NotFoundError();
    } else {
      throw new Error(); // must be some other error; we will respond with a status code 500
    }
  } else {
    const title = pageMetaQueryResult.data?.title;
    dispatch(
      updatePageMeta(
        buildPageMeta({
          title
        })
      )
    );
  }
};

const fetchVariantData = async ({
  genomeId,
  variantId,
  dispatch
}: {
  genomeId: string;
  variantId: string;
  dispatch: AppDispatch;
}) => {
  const pageMetaPromise = dispatch(
    fetchVariantPageMeta.initiate({
      genomeId,
      variantId
    })
  );
  const pageMetaQueryResult = await pageMetaPromise;
  pageMetaPromise.unsubscribe();

  if (pageMetaQueryResult?.error) {
    if ((pageMetaQueryResult.error as any)?.meta?.data?.variant === null) {
      // this is graphql's way of telling us that there is no such variant
      throw new NotFoundError();
    } else {
      throw new Error(); // must be some other error; we will respond with a status code 500
    }
  } else {
    const title = pageMetaQueryResult.data?.title;
    dispatch(
      updatePageMeta(
        buildPageMeta({
          title
        })
      )
    );
  }
};
