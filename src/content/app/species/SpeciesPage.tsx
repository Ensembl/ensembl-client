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

import { useAppDispatch, useAppSelector } from 'src/store';

import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import { getGenomeByUrlId } from 'src/shared/state/genome/genomeSelectors';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';

import useHasMounted from 'src/shared/hooks/useHasMounted';

import {
  fetchGenomeSummary,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { getPathParameters, useUrlParams } from 'src/shared/hooks/useUrlParams';

import type { ServerFetch } from 'src/routes/routesConfig';
import type { AppDispatch } from 'src/store';

const LazylyLoadedSpeciesPageContent = React.lazy(
  () => import('./SpeciesPageContent')
);

const defaultTitle = 'Species page — Ensembl';
const defaultDescription = 'Species home page';

const SpeciesPage = () => {
  const hasMounted = useHasMounted();
  const params = useUrlParams<'genomeId'>(['/species/:genomeId']);
  const dispatch = useAppDispatch();
  const { genomeId: genomeIdInUrl } = params;

  const species = useAppSelector((state) =>
    getGenomeByUrlId(state, genomeIdInUrl as string)
  );

  const title = species ? `${getDisplayName(species)} — Ensembl` : defaultTitle;

  useEffect(() => {
    if (!title) {
      return;
    }

    dispatch(
      updatePageMeta({
        title,
        description: defaultDescription
      })
    );
  }, [title]);

  return hasMounted ? <LazylyLoadedSpeciesPageContent /> : null;
};

export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;
  const dispatch: AppDispatch = store.dispatch;
  const { genomeId: genomeIdFromUrl } = getPathParameters<'genomeId'>(
    '/species/:genomeId/',
    path
  ) as { genomeId: string };

  const genomeInfoResponsePromise = dispatch(
    fetchGenomeSummary.initiate(genomeIdFromUrl)
  );
  const { data: genomeInfo, error: genomeInfoError } =
    await genomeInfoResponsePromise;

  if (isGenomeNotFoundError(genomeInfoError)) {
    return {
      status: 404
    };
  } else {
    const title = genomeInfo ? getDisplayName(genomeInfo) : defaultTitle;
    dispatch(
      updatePageMeta({
        title,
        description: defaultDescription // TODO: eventually, decide what page description should be here
      })
    );
  }
};

export default SpeciesPage;
