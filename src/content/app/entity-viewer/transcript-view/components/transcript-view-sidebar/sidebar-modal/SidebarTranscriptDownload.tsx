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

import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';
import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import InstantDownloadTranscript from 'src/shared/components/instant-download/instant-download-transcript/InstantDownloadTranscript';

import styles from './SidebarTranscriptDownload.module.css';

const SidebarTranscriptDownload = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const { currentData } = useDefaultEntityViewerTranscriptQuery(
    {
      genomeId: activeGenomeId ?? '',
      transcriptId: transcriptId ?? ''
    },
    {
      skip: !activeGenomeId || !transcriptId
    }
  );

  const transcript = currentData?.transcript;
  if (!activeGenomeId || !transcript) {
    return null;
  }

  return (
    <InstantDownloadTranscript
      genomeId={activeGenomeId}
      transcript={{
        id: transcript.stable_id,
        isProteinCoding: isProteinCodingTranscript(transcript)
      }}
      gene={{
        id: transcript.gene.stable_id
      }}
      layout="vertical"
      theme="light"
      className={styles.instantDownloadTranscript}
    />
  );
};

export default SidebarTranscriptDownload;
