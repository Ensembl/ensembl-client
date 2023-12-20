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
import { scaleLinear } from 'd3';
import classNames from 'classnames';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.module.css';
import styles from './ProteinImage.module.css';

const TRACK_HEIGHT = 24;
const PROTEIN_HEIGHT = 10;

type ProteinImageProps = {
  proteinLength: number;
  trackLength: number; // length in amino acids
  className?: string;
  width: number; // available width for drawing in pixels
};

const ProteinImage = (props: ProteinImageProps) => {
  // Create a scale where the domain is the total length of the track in amino acids.
  // The track is as wide as the longest protein generated from the gene.
  // Therefore, it is guaranteed that the length of the protein drawn by this component will fall within this domain.
  const scale = scaleLinear()
    .domain([0, props.trackLength])
    .rangeRound([0, props.width])
    .clamp(true);

  const trackContainerStyles = transcriptsListStyles.middle;
  const labelStyles = classNames(transcriptsListStyles.right, styles.label);

  return (
    <div className={transcriptsListStyles.row}>
      <div className={trackContainerStyles}>
        <svg
          className={styles.containerSvg}
          width={props.width}
          height={TRACK_HEIGHT}
        >
          <g>
            <g className={styles.track}>
              <rect height={TRACK_HEIGHT} width={props.width} />
            </g>
            <g>
              <rect
                className={styles.protein}
                y="8"
                height={PROTEIN_HEIGHT}
                width={scale(props.proteinLength)}
              />
            </g>
          </g>
        </svg>
      </div>
      <div className={labelStyles}>Amino acid length</div>
    </div>
  );
};

export default ProteinImage;
