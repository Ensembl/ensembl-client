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

import { use, lazy, useEffect } from 'react';
import { browser } from 'react-dom';

import { useAppDispatch } from 'src/store';

import useToolsAvailability from 'src/content/app/tools/shared/hooks/useToolsAvailability';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';

import ToolsDownError from 'src/content/app/tools/shared/components/tools-down-error/ToolsDownError';

import type { ServerFetch } from 'src/routes/routesConfig';

const VepPageContent = lazy(() => import('./VepPageContent'));

// Copied these from the current Ensembl site; will probably need changing in the future.
const pageTitle = 'Ensembl Variant Effect Predictor (VEP)';
const pageDescription = `
VEP determines the effect of your variants (SNPs, insertions, deletions, CNVs or structural variants)
on genes, transcripts, and protein sequence, as well as regulatory regions.
`;

const VepPage = () => {
  use(browser());
  const { areToolsAvailable, downtimeMessage } = useToolsAvailability();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updatePageMeta({
        title: pageTitle,
        description: pageDescription
      })
    );
  }, [dispatch]);

  if (!areToolsAvailable) {
    return (
      <ToolsDownError
        toolName="Ensembl VEP"
        description={downtimeMessage ?? undefined}
      />
    );
  }

  return <VepPageContent />;
};

export default VepPage;

// not really fetching anything; just setting page meta
export const serverFetch: ServerFetch = async (params) => {
  params.store.dispatch(
    updatePageMeta({
      title: pageTitle,
      description: pageDescription
    })
  );
};
