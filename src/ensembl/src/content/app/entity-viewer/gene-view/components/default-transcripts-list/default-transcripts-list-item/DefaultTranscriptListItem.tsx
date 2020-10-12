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

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import TranscriptsListItemInfo from '../transcripts-list-item-info/TranscriptsListItemInfo';

import { toggleTranscriptInfo } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

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
  const { start: geneStart } = getFeatureCoordinates(props.gene);
  const { start: transcriptStart, end: transcriptEnd } = getFeatureCoordinates(
    props.transcript
  );
  const transcriptStartX = scale(transcriptStart - geneStart); // FIXME In future, this should be done using relative position of transcript in gene
  const transcriptWidth = scale(transcriptEnd - transcriptStart) as number; // FIXME  this too should be based on relative coordinates of transcript

  const defaultTranscriptLabelMap = {
    selected: {
      label: 'Selected',
      helpText:
        'The selected transcript is a default single transcript per protein coding gene that is representative of biology, well-supported, expressed and highly conserved'
    }
  };

  const canonicalType = 'selected'; // TODO Change this to transcript.mane/plus etc when available

  return (
    <div className={styles.defaultTranscriptListItem}>
      <div className={transcriptsListStyles.row}>
        {props.isDefault && (
          <div className={styles.defaultTranscriptLabel}>
            <span>{defaultTranscriptLabelMap[canonicalType]?.label}</span>
            <QuestionButton
              helpText={defaultTranscriptLabelMap[canonicalType]?.helpText}
            />
          </div>
        )}
        <div className={transcriptsListStyles.middle}>
          <div
            className={styles.clickableTranscriptArea}
            onClick={() => props.toggleTranscriptInfo(props.transcript.id)}
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
          onClick={() => props.toggleTranscriptInfo(props.transcript.id)}
        >
          <span className={styles.transcriptId}>{props.transcript.id}</span>
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
