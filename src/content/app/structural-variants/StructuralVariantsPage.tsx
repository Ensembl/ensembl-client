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

import { lazy, useEffect } from 'react';

import { useAppDispatch } from 'src/store';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';

import type { ServerFetch } from 'src/routes/routesConfig';

const LazilyLoadedStructuralVariants = lazy(
  () => import('./StructuralVariants')
);

const pageTitle = 'Structural variants — Ensembl';
const pageDescription = 'Alignments viewer for structural variants';

const StructuralVariantsPage = () => {
  const hasMounted = useHasMounted();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updatePageMeta({
        title: pageTitle,
        description: pageDescription
      })
    );
  }, []);

  return hasMounted ? <LazilyLoadedStructuralVariants /> : null;
};

export default StructuralVariantsPage;

// not really fetching anything; just setting page meta
export const serverFetch: ServerFetch = async (params) => {
  params.store.dispatch(
    updatePageMeta({
      title: pageTitle,
      description: pageDescription
    })
  );
};
