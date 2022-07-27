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

import { useAppSelector } from 'src/store';

import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import { getGenomeByUrlId } from 'src/shared/state/genome/genomeSelectors';

import useHasMounted from 'src/shared/hooks/useHasMounted';

import {
  fetchGenomeInfo,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { getPathParameters, useUrlParams } from 'src/shared/hooks/useUrlParams';

import type { ServerFetch } from 'src/routes/routesConfig';
import type { AppDispatch } from 'src/store';

const LoadableSpeciesPageContent = loadable(
  () => import('./SpeciesPageContent')
);

const SpeciesPage = () => {
  const hasMounted = useHasMounted();
  const params = useUrlParams<'genomeId'>(['/species/:genomeId']);
  const { genomeId: genomeIdInUrl } = params;

  const species = useAppSelector((state) =>
    getGenomeByUrlId(state, genomeIdInUrl as string)
  );

  const title = species
    ? `${getDisplayName(species)} — Ensembl`
    : 'Species page — Ensembl';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Species home page" />
      </Helmet>
      {hasMounted && <LoadableSpeciesPageContent />}
    </>
  );
};

export const serverFetch: ServerFetch = async (params) => {
  const { path, store } = params;
  const dispatch: AppDispatch = store.dispatch;
  const { genomeId: genomeIdFromUrl } = getPathParameters<'genomeId'>(
    '/species/:genomeId/',
    path
  ) as { genomeId: string };

  const genomeInfoResponsePromise = dispatch(
    fetchGenomeInfo.initiate(genomeIdFromUrl)
  );
  const { error: genomeInfoError } = await genomeInfoResponsePromise;

  if (isGenomeNotFoundError(genomeInfoError)) {
    return {
      status: 404
    };
  }
};

export default SpeciesPage;
