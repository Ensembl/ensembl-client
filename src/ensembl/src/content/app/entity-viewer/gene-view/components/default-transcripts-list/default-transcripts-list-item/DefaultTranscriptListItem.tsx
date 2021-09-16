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
import { useDispatch } from 'react-redux';

import UnsplicedTranscript, {
  UnsplicedTranscriptProps
} from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import TranscriptsListItemInfo, {
  TranscriptsListItemInfoProps
} from '../transcripts-list-item-info/TranscriptsListItemInfo';

import { toggleTranscriptInfo } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { TranscriptQualityLabel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './DefaultTranscriptListItem.scss';

type Transcript = Pick<
  FullTranscript,
  'stable_id' | 'relative_location' | 'metadata'
> &
  TranscriptsListItemInfoProps['transcript'] &
  UnsplicedTranscriptProps['transcript'];

export type DefaultTranscriptListItemProps = {
  gene: TranscriptsListItemInfoProps['gene'];
  transcript: Transcript;
  rulerTicks: TicksAndScale;
  expandTranscript: boolean;
  expandDownload: boolean;
  expandMoreInfo: boolean;
};

export const DefaultTranscriptListItem = (
  props: DefaultTranscriptListItemProps
) => {
  const { scale } = props.rulerTicks;
  const {
    relative_location: { start: relativeTranscriptStart },
    slice: {
      location: { length: transcriptLength }
    }
  } = props.transcript;
  const transcriptStartX = scale(relativeTranscriptStart) as number;
  const transcriptWidth = scale(transcriptLength) as number;

  const dispatch = useDispatch();

  const handleTranscriptClick = () => {
    dispatch(toggleTranscriptInfo(props.transcript.stable_id));
  };

  return (
    <div className={styles.defaultTranscriptListItem}>
      <div className={transcriptsListStyles.row}>
        <TranscriptQualityLabel metadata={props.transcript.metadata} />

        <div className={transcriptsListStyles.middle}>
          <div
            className={styles.clickableTranscriptArea}
            onClick={handleTranscriptClick}
          >
            <div
              className={styles.transcriptWrapper}
              style={{ transform: `translateX(${transcriptStartX}px)` }}
            >
              <UnsplicedTranscript
                transcript={props.transcript}
                width={transcriptWidth}
                standalone={true}
              />
            </div>
          </div>
        </div>
        <div
          className={transcriptsListStyles.right}
          onClick={handleTranscriptClick}
        >
          <span className={styles.transcriptId}>
            {props.transcript.stable_id}
          </span>
        </div>
      </div>
      {props.expandTranscript ? (
        <TranscriptsListItemInfo
          gene={props.gene}
          transcript={props.transcript}
          expandDownload={props.expandDownload}
          expandMoreInfo={props.expandMoreInfo}
        />
      ) : null}
    </div>
  );
};

export default DefaultTranscriptListItem;
