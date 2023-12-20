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

import useGeneViewIds from 'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds';
import { useGeneSummaryQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import { GeneSummaryStrip } from 'src/shared/components/feature-summary-strip';

import type { GeneSummary } from 'src/content/app/entity-viewer/state/api/queries/geneSummaryQuery';

import styles from './EntityViewerTopbar.module.css';

export const EntityViewerTopbar = () => {
  const { genomeId, geneId = '' } = useGeneViewIds();

  // NOTE: when we introduce entities other than gene,
  // either the component's name will have to change, or the data fetcher below
  const { currentData } = useGeneSummaryQuery(
    {
      genomeId: genomeId as string,
      geneId
    },
    {
      skip: !geneId
    }
  );

  return (
    <div className={styles.container}>
      {currentData ? (
        <GeneSummaryStrip gene={geneToFocusObjectFields(currentData.gene)} />
      ) : null}
    </div>
  );
};

// NOTE: temporary adaptor
const geneToFocusObjectFields = (gene: GeneSummary) => {
  return {
    stable_id: gene.unversioned_stable_id,
    versioned_stable_id: gene.stable_id,
    label: gene.symbol ?? '',
    bio_type: gene.metadata.biotype.label,
    strand: gene.slice.strand.code,
    location: {
      chromosome: gene.slice.region.name,
      start: gene.slice.location.start,
      end: gene.slice.location.end
    }
  };
};

export default EntityViewerTopbar;
