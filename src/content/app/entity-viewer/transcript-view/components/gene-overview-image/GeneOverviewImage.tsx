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

import { scaleLinear } from 'd3';
import { Pick3 } from 'ts-multipick';

import {
  getFeatureCoordinates,
  getFeatureLength
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
// import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import {
  GENE_IMAGE_WIDTH,
  GENE_IMAGE_HEIGHT
} from 'src/content/app/entity-viewer/gene-view/constants/geneViewConstants';

import UnsplicedTranscript, {
  UnsplicedTranscriptProps,
  UNSPLICED_TRANSCRIPT_HEIGHT
} from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import FeatureLengthRuler, {
  type TicksAndScale
} from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { FullTranscript } from 'src/shared/types/core-api/transcript';

import commonStyles from '../../TranscriptView.module.css';
import styles from './GeneOverviewImage.module.css';

type Gene = Pick<FullGene, 'stable_id'> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end' | 'length'>;

type Transcript = UnsplicedTranscriptProps['transcript'] &
  Pick3<FullTranscript, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick3<FullTranscript, 'slice', 'strand', 'code'> &
  Pick<FullTranscript, 'stable_id'>;

export type GeneOverviewImageProps = {
  transcript: Transcript;
  gene: Gene;
  onTicksCalculated: (payload: TicksAndScale) => void;
};

const GeneOverviewImage = (props: GeneOverviewImageProps) => {
  const length = getFeatureLength(props.gene);

  return (
    <div className={commonStyles.gridColumns}>
      <TranscriptId {...props} />
      <DirectionIndicator />
      <GeneImage {...props} />
      <StrandIndicator {...props} />
      {/* <NumberOfTranscripts {...props} /> */}
      <div className={styles.ruler}>
        <FeatureLengthRuler
          length={length}
          width={GENE_IMAGE_WIDTH}
          rulerLabel="bp"
          onTicksCalculated={props.onTicksCalculated}
          standalone={true}
        />
      </div>
    </div>
  );
};

export const GeneImage = (props: GeneOverviewImageProps) => {
  const { start: geneStart, end: geneEnd } = getFeatureCoordinates(props.gene);
  const { transcript } = props;

  const geneScale = scaleLinear()
    .domain([geneStart, geneEnd])
    .rangeRound([0, GENE_IMAGE_WIDTH]);

  const { start: transcriptStart, end: transcriptEnd } =
    getFeatureCoordinates(transcript);
  const startX = geneScale(transcriptStart);
  const endX = geneScale(transcriptEnd);
  const y = GENE_IMAGE_HEIGHT / 2 - UNSPLICED_TRANSCRIPT_HEIGHT / 2; // offset from the top of the drawing area
  const width = Math.floor(endX - startX);

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${GENE_IMAGE_WIDTH} ${GENE_IMAGE_HEIGHT}`}
      width={GENE_IMAGE_WIDTH}
    >
      <g transform={`translate(${startX} ${y})`}>
        <UnsplicedTranscript
          transcript={transcript}
          width={width}
          classNames={{
            transcript: styles.transcript
          }}
        />
      </g>
    </svg>
  );
};

const TranscriptId = (props: GeneOverviewImageProps) => (
  <div className={styles.transcriptId}>
    <span className={styles.light}>Location in gene</span>
    <span>{props.transcript.stable_id}</span>
  </div>
);

const DirectionIndicator = () => {
  return (
    <div className={styles.directionIndicator}>
      <span>5'</span>
      <span>3'</span>
    </div>
  );
};

const StrandIndicator = (props: GeneOverviewImageProps) => {
  const {
    transcript: {
      slice: {
        strand: { code: strandCode }
      }
    }
  } = props;

  return (
    <div className={styles.strand}>{getStrandDisplayName(strandCode)}</div>
  );
};

export default GeneOverviewImage;
