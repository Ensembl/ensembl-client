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

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { useTranscriptInfoQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import styles from './SequenceViewerTopBar.module.css';

const TranscriptTopBar = () => {
  const { parsedFocusObjectId, genomeId } = useSequenceViewerIds();
  const { currentData } = useTranscriptInfoQuery(
    {
      genomeId: genomeId ?? '',
      stableId: parsedFocusObjectId?.objectId ?? ''
    },
    {
      skip: !genomeId || !parsedFocusObjectId
    }
  );

  if (!currentData) {
    return null;
  }

  const { transcript } = currentData;

  return (
    <div className={styles.focusWrapper}>
      <div className={styles.labelGroup}>
        <span className={styles.label}>Transcript</span>
        <span>{transcript.stable_id}</span>
      </div>

      <div className={styles.labelGroup}>
        <span className={styles.label}>Biotype</span>
        <span>{transcript.biotype}</span>
      </div>

      <div>
        <span>
          {transcript.strand}
          {' strand'}
        </span>
      </div>

      <div>
        <span>
          {getFormattedLocation({
            chromosome: transcript.region_name,
            start: transcript.start,
            end: transcript.end
          })}
        </span>
      </div>
    </div>
  );
};

export default TranscriptTopBar;
