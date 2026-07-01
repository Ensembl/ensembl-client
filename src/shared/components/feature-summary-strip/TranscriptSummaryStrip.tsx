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

import classNames from 'classnames';

import { getDisplayStableId } from 'src/shared/helpers/focusObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';

import type { FocusTranscript } from 'src/shared/types/focus-object/focusObjectTypes';
import type { Variety } from './types';

import styles from './FeatureSummaryStrip.module.css';

type TranscriptFields =
  | 'bio_type'
  | 'label'
  | 'versioned_stable_id'
  | 'stable_id'
  | 'strand'
  | 'location';
type Transcript = Pick<FocusTranscript, TranscriptFields>;

type Props = {
  transcript: Transcript;
  className?: string;
  variety?: Variety;
};

const TranscriptSummaryStrip = (props: Props) => {
  const { transcript, className, variety = 'default' } = props;
  const stableId = getDisplayStableId(transcript);
  const stripClasses = classNames(styles.featureSummaryStrip, className);

  if (variety === 'minimal') {
    return (
      <div className={stripClasses}>
        <span className={styles.featureSummaryStripLabel}>Transcript</span>
        <span className={styles.featureNameEmphasized}>{stableId}</span>
      </div>
    );
  }

  return (
    <div className={stripClasses}>
      <div className={styles.section}>
        <span className={styles.featureSummaryStripLabel}>Transcript</span>
        <span className={styles.featureNameEmphasized}>{stableId}</span>
      </div>
      <div className={styles.section}>
        <span className={styles.featureSummaryStripLabel}>Biotype</span>
        {transcript.bio_type}
      </div>
      <div className={styles.section}>
        {getStrandDisplayName(transcript.strand)}
      </div>
      <div className={styles.section}>
        {getFormattedLocation(transcript.location)}
      </div>
    </div>
  );
};

export default TranscriptSummaryStrip;
