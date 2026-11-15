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

import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';
import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import {
  updateSequenceSettings,
  type SequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import {
  useGeneInfoQuery,
  useGeneSequenceOptionsQuery
} from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import GeneName from 'src/shared/components/gene-name/GeneName';
import { SidebarLoader } from 'src/shared/components/loader';
import {
  SequenceOptionsSections,
  FlankingSequences
} from 'src/content/app/sequence-viewer/components/sequence-viewer-sidebar/sequence-options/SequenceOptions';

import styles from './SequenceViewerSidebar.module.css';

const GeneSequenceSidebar = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const geneId = parsedFocusObjectId?.objectId;
  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'gene',
      genomeId: genomeId ?? '',
      geneId: geneId ?? ''
    })
  );
  const dispatch = useAppDispatch();

  const { currentData: geneInfo, isFetching: isFetchingGeneInfo } =
    useGeneInfoQuery({
      genomeId: genomeId ?? '',
      stableId: geneId ?? ''
    });
  const { currentData: fetchedSequenceOptions } = useGeneSequenceOptionsQuery(
    {
      geneId: geneId ?? '',
      genomeId: genomeId ?? ''
    },
    {
      skip: !geneId || !genomeId
    }
  );

  const onSettingsChange = useCallback(
    (options: SequenceSettings['options']) => {
      if (!genomeId || !geneId) {
        // this shouldn't be possible
        return;
      }

      dispatch(
        updateSequenceSettings({
          type: 'gene',
          genomeId,
          geneId,
          options
        })
      );
    },
    [dispatch, genomeId, geneId]
  );

  if (isFetchingGeneInfo) {
    return <SidebarLoader />;
  }
  if (!geneInfo) {
    return null;
  }

  // style={{ display: 'flex', flexDirection: 'column', rowGap: '0.6rem' }}

  return (
    <div>
      <div className={styles.labelledRow}>
        <span className={styles.label}>Gene</span>
        <GeneName
          stable_id={geneInfo.gene.stable_id}
          symbol={geneInfo.gene.symbol}
        />
      </div>

      {fetchedSequenceOptions?.flanking && sequenceSettings?.options && (
        <FlankingSequences
          flanking={fetchedSequenceOptions.flanking}
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
        />
      )}

      {fetchedSequenceOptions && sequenceSettings?.options && (
        <SequenceOptionsSections
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
          sections={fetchedSequenceOptions.sections}
        />
      )}
    </div>
  );
};

export default GeneSequenceSidebar;
