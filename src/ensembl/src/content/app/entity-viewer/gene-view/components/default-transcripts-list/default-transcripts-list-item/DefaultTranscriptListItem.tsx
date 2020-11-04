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
import { connect } from 'react-redux';

import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import TranscriptsListItemInfo from '../transcripts-list-item-info/TranscriptsListItemInfo';

import { toggleTranscriptInfo } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import {
  DefaultTranscriptLabelMap,
  CanonicalType
} from 'src/content/app/entity-viewer/shared/components/default-transcript/DefaultTranscript';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './DefaultTranscriptListItem.scss';

type defaultTranscriptLabelType = {
  label: string;
  helpText: string;
};

export type DefaultTranscriptListItemProps = {
  gene: Gene;
  isDefault?: boolean;
  defaultTranscriptLabel?: defaultTranscriptLabelType;
  transcript: Transcript;
  rulerTicks: TicksAndScale;
  expandTranscript: boolean;
  expandDownload: boolean;
  toggleTranscriptInfo: (id: string) => void;
};

// NOTE: the width of the middle column is the same as the width of GeneOverviewImage, i.e. 695px

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

  return (
    <div className={styles.defaultTranscriptListItem}>
      <div className={transcriptsListStyles.row}>
        {props.isDefault && (
          <div className={styles.defaultTranscriptLabel}>
            <span>{DefaultTranscriptLabelMap[CanonicalType]?.label}</span>
            <QuestionButton
              helpText={DefaultTranscriptLabelMap[CanonicalType]?.helpText}
            />
          </div>
        )}
        <div className={transcriptsListStyles.middle}>
          <div
            className={styles.clickableTranscriptArea}
            onClick={() =>
              props.toggleTranscriptInfo(props.transcript.stable_id)
            }
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
          onClick={() => props.toggleTranscriptInfo(props.transcript.stable_id)}
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
        />
      ) : null}
    </div>
  );
};

const mapDispatchToProps = {
  toggleTranscriptInfo
};

export default connect(null, mapDispatchToProps)(DefaultTranscriptListItem);
