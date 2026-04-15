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

import { useState } from 'react';
import classNames from 'classnames';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';
import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import GeneOverviewImage from './components/gene-overview-image/GeneOverviewImage';
import TranscriptViewTabs from './components/transcript-view-tabs/TranscriptViewTabs';
import TranscriptFunction from './components/transcript-function/TranscriptFunction';

import styles from './TranscriptView.module.css';

const TranscriptView = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const [selectedView, setSelectedView] = useState('Transcript'); // this is temporary
  const { currentData } = useDefaultEntityViewerTranscriptQuery(
    {
      genomeId: activeGenomeId ?? '',
      transcriptId: transcriptId ?? ''
    },
    {
      skip: !activeGenomeId || !transcriptId
    }
  );

  if (!currentData) {
    return null; // FIXME: show a spinner?
  }

  return (
    <div className={styles.container}>
      <GeneOverviewImage
        transcript={currentData.transcript}
        gene={currentData.transcript.gene}
        onTicksCalculated={(ticks) => console.log('ticks calculated!', ticks)}
      />
      <div className={classNames(styles.tabsSection, styles.gridColumns)}>
        <div className={styles.tabs}>
          <TranscriptViewTabs
            activeView={selectedView}
            onViewChange={setSelectedView}
          />
        </div>
      </div>
      {selectedView === 'Transcript' ? (
        <div className={styles.gridColumns}>
          <div>Left</div>
          <div className={styles.middleColumn}>
            Default content for the transcript view for{' '}
            {currentData?.transcript.stable_id}
          </div>
        </div>
      ) : (
        <TranscriptFunction />
      )}
    </div>
  );
};

export default TranscriptView;
