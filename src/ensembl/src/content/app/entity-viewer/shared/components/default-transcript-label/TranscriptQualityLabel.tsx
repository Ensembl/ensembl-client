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

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import styles from './TranscriptQualityLabel.scss';

type TranscriptQualityLabelProps = {
  transcript: Transcript;
};

const transcriptLabelMap = {
  selected: {
    label: 'Selected',
    helpText:
      'The selected transcript is a default single transcript per protein coding gene that is representative of biology, well-supported, expressed and highly conserved'
  }
};

export const TranscriptQualityLabel = (props: TranscriptQualityLabelProps) => {
  const transcriptQuality = props.transcript && 'selected'; // TODO Change this to props.transcript.mane/plus etc when available

  return (
    <div className={styles.transcriptQualityLabel}>
      <span>{transcriptLabelMap[transcriptQuality]?.label}</span>
      <QuestionButton
        helpText={transcriptLabelMap[transcriptQuality]?.helpText}
      />
    </div>
  );
};
