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

import React, { useState, useEffect } from 'react';
import { scaleLinear } from 'd3';
import classNames from 'classnames';

import { fetchTranscript } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Product } from 'src/content/app/entity-viewer/types/product';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './CollapsedExonsImage.scss';

const TRACK_HEIGHT = 24;
const PROTEIN_HEIGHT = 10;

type ExonsImageProps = {
  transcriptId: string;
  trackLength: number; // length in amino acids
  className?: string;
  width: number; // available width for drawing in pixels
};

type ExonsImageWithDataProps = Omit<ExonsImageProps, 'transcriptId'> & {
  product: Product;
};

export const ExonsImage = (props: ExonsImageProps) => {
  const [transcript, setTranscript] = useState<Transcript | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchTranscript(props.transcriptId, abortController.signal).then(
      (result) => {
        if (result) {
          setTranscript(result);
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, [props.transcriptId]);

  return transcript?.product ? (
    <ExonsImageWithData
      product={transcript.product}
      trackLength={props.trackLength}
      className={props.className}
      width={props.width}
    />
  ) : null;
};

const ExonsImageWithData = (props: ExonsImageWithDataProps) => {
  // Create a scale where the domain is the total length of the track in amino acids.
  // The track is as wide as the longest protein generated from the gene.
  // Therefore, it is guaranteed that the length of the protein drawn by this component will fall within this domain.
  const scale = scaleLinear()
    .domain([0, props.trackLength])
    .range([0, props.width])
    .clamp(true);

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <div className={transcriptsListStyles.row}>
      <div className={midStyles}>
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
                width={scale(props.product.length as number)}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ExonsImage;
