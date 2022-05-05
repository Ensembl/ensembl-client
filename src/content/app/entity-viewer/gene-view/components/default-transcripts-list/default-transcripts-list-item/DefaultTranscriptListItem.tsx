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

import { useAppDispatch } from 'src/store';

import {
  getTranscriptMetadata,
  TranscriptQualityLabel
} from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import TranscriptsListItemInfo from '../transcripts-list-item-info/TranscriptsListItemInfo';

import { toggleTranscriptInfo } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import type { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import type { DefaultEntityViewerGeneQueryResult } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './DefaultTranscriptListItem.scss';

export type DefaultTranscriptListItemProps = {
  transcriptPosition: number;
  gene: DefaultEntityViewerGeneQueryResult['gene'];
  transcript: DefaultEntityViewerGeneQueryResult['gene']['transcripts'][number];
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

  const dispatch = useAppDispatch();
  const { trackTranscriptListViewToggle } = useEntityViewerAnalytics();

  const handleTranscriptClick = () => {
    dispatch(toggleTranscriptInfo(props.transcript.stable_id));

    trackTranscriptListViewToggle({
      transcriptQuality: getTranscriptMetadata(props.transcript)?.label,
      transcriptId: props.transcript.stable_id,
      action: !props.expandTranscript ? 'open_accordion' : 'close_accordion',
      transcriptPosition: props.transcriptPosition
    });
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
