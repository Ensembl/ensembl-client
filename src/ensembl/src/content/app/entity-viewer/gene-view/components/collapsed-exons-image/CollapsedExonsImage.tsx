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

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './CollapsedExonsImage.scss';

const IMAGE_HEIGHT = 24;
const PROTEIN_HEIGHT = 10;

type ExonsImageProps = {
  transcriptId: string;
  longestProteinLength: number;
  className?: string;
  width: number; // available width for drawing, in pixels
};

type ExonsImageWithDataProps = Omit<ExonsImageProps, 'transcriptId'> & {
  transcript: Transcript;
};

export const ExonsImage = (props: ExonsImageProps) => {
  const [data, setData] = useState<Transcript | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchTranscript(props.transcriptId, abortController.signal).then(
      (result) => {
        if (result) {
          setData(result);
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, [props.transcriptId]);

  return data ? (
    <ExonsImageWithData
      transcript={data}
      longestProteinLength={props.longestProteinLength}
      className={props.className}
      width={props.width}
    />
  ) : null;
};

const ExonsImageWithData = (props: ExonsImageWithDataProps) => {
  const { transcript } = props;

  if (!transcript.product) {
    return null;
  }

  // If we consider the image's starting point as A and end point as B the scale can be sketched as:
  // A--  longest protein's length  --B
  // A--      width in pixels       --B
  const scale = scaleLinear()
    .domain([0, props.longestProteinLength])
    .range([0, props.width])
    .clamp(true);

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  // The scale/longest protein is displayed using the first <rect> from point A to point B
  // The protein is displayed from point A (check comment above) using the second <rect>
  return (
    <div className={transcriptsListStyles.row}>
      <div className={midStyles}>
        <svg
          className={styles.containerSvg}
          width={props.width}
          height={IMAGE_HEIGHT}
        >
          <g>
            <g className={styles.longestProtein}>
              <rect height={IMAGE_HEIGHT} width={props.width} />
            </g>
            <g>
              <rect
                className={styles.protein}
                y="8"
                height={PROTEIN_HEIGHT}
                width={scale(transcript.product?.length)}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ExonsImage;
