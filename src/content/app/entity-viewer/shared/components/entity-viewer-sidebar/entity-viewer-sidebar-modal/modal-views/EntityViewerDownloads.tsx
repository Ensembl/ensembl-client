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
import { useSelector } from 'react-redux';

import { useGeneForSequenceDownloadQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import {
  getEntityViewerActiveEntityId,
  getEntityViewerActiveGenomeId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';
import { isProteinCodingGene } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import InstantDownloadGene, {
  OnDownloadPayload
} from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';

const EntityViewerSidebarDownloads = () => {
  const genomeId = useSelector(getEntityViewerActiveGenomeId);
  const activeEntityId = useSelector(getEntityViewerActiveEntityId);
  const { trackGeneDownload } = useEntityViewerAnalytics();

  const geneId = activeEntityId
    ? parseFocusObjectId(activeEntityId).objectId
    : null;

  const { currentData } = useGeneForSequenceDownloadQuery(
    {
      genomeId: genomeId || '',
      geneId: geneId || ''
    },
    {
      skip: !genomeId || !geneId
    }
  );

  if (!currentData) {
    return null;
  }

  const onDownload = (
    payload: OnDownloadPayload,
    downloadStatus: 'success' | 'failure'
  ) => {
    const { transcript: transcriptOptions, gene: geneOptions } =
      payload.options;

    const downloadOptions = Object.entries(transcriptOptions)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => `transcript_${key}`);

    if (geneOptions.genomicSequence) {
      downloadOptions.unshift('gene_genomicSequence');
    }

    trackGeneDownload({
      geneSymbol: currentData.gene.stable_id,
      options: downloadOptions,
      downloadStatus
    });
  };

  return (
    <section>
      <InstantDownloadGene
        genomeId={genomeId as string}
        gene={{
          id: currentData.gene.stable_id,
          isProteinCoding: isProteinCodingGene(currentData.gene)
        }}
        onDownloadSuccess={(payload) => onDownload(payload, 'success')}
        onDownloadFailure={(payload) => onDownload(payload, 'failure')}
      />
    </section>
  );
};

export default EntityViewerSidebarDownloads;
