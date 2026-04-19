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

import { getFeatureLength } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { TranscriptQualityLabel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import TranscriptInfoPanel from 'src/content/app/entity-viewer/transcript-view/components/transcript-details/transcript-info-panel/TranscriptInfoPanel';

import type { DefaultEntityViewerTranscriptQueryResult } from 'src/content/app/entity-viewer/state/api/queries/transcriptDefaultQuery';
import type { TicksAndScale } from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';

import commonStyles from '../../TranscriptView.module.css';
import styles from './TranscriptDetails.module.css';

type Transcript = DefaultEntityViewerTranscriptQueryResult['transcript'];

export type Props = {
  genomeId: string;
  transcript: Transcript;
  rulerTicks: TicksAndScale;
};

const TranscriptDetails = (props: Props) => {
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
    <div className={styles.container}>
      <div className={classNames(styles.header, commonStyles.gridColumns)}>
        <div className={styles.columnRight}>Transcript ID</div>
      </div>
      <div className={styles.main}>
        <StripedBackground {...props} />
        <div className={classNames(commonStyles.gridColumns, styles.row)}>
          <TranscriptQualityLabel metadata={props.transcript.metadata} />
          <div className={styles.columnMiddle}>
            <div
              className={styles.transcriptImageWrapper}
              style={{ transform: `translateX(${transcriptStartX}px)` }}
            >
              <UnsplicedTranscript
                transcript={props.transcript}
                width={transcriptWidth}
                standalone={true}
              />
            </div>
          </div>
          <div className={styles.columnRight}>{props.transcript.stable_id}</div>
        </div>
        <div className={classNames(commonStyles.gridColumns, styles.row)}>
          <TranscriptInfoPanel
            genomeId={props.genomeId}
            transcript={props.transcript}
            gene={props.transcript.gene}
            className={styles.columnMiddle}
          />
        </div>
      </div>
    </div>
  );
};

const StripedBackground = (props: Props) => {
  const { scale, ticks } = props.rulerTicks;
  const geneLength = getFeatureLength(props.transcript.gene);
  const extendedTicks = [1, ...ticks, geneLength];

  const stripes = extendedTicks.map((tick) => {
    const x = Math.floor(scale(tick) as number);
    const style = { left: `${x}px` };
    return <span key={x} className={styles.stripe} style={style} />;
  });

  return <div className={styles.stripedBackground}>{stripes}</div>;
};

export default TranscriptDetails;
