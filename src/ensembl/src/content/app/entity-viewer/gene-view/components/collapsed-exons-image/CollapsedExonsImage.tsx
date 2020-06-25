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
import { scaleLinear, ScaleLinear } from 'd3';
import classNames from 'classnames';

import { fetchTranscript } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';
import {
  getCodingExonsForImage,
  getFeatureCoordinates
} from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './CollapsedExonsImage.scss';

const IMAGE_HEIGHT = 24;
const EXON_HEIGHT = 10;

type ExonsImageProps = {
  transcriptId: string;
  refCDSLength: number;
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
      refCDSLength={props.refCDSLength}
      className={props.className}
      width={props.width}
    />
  ) : null;
};

const ExonsImageWithData = (props: ExonsImageWithDataProps) => {
  const { transcript } = props;

  if (!transcript.cds) {
    return null;
  }

  const codingExons = getCodingExonsForImage(transcript);

  const getSplicedRNALength = () => {
    const rnaLength = transcript.exons.reduce((length, exon) => {
      const { start, end } = getFeatureCoordinates(exon);
      return length + (end - start + 1);
    }, 0);

    return getCommaSeparatedNumber(rnaLength);
  };

  const scale = scaleLinear()
    .domain([0, props.refCDSLength])
    .range([0, props.width])
    .clamp(true);

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <div className={transcriptsListStyles.row}>
      <div className={midStyles}>
        <svg
          className={styles.containerSvg}
          width={props.width}
          height={IMAGE_HEIGHT}
        >
          <g>
            <g className={styles.splicedRNABlock}>
              <rect height={IMAGE_HEIGHT} width={props.width} />
            </g>
            {codingExons.map((exon, index) => (
              <ExonBlock
                key={index}
                exon={exon}
                className={props.className}
                scale={scale}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className={transcriptsListStyles.right}>
        Spliced RNA length <strong>{getSplicedRNALength()}</strong> bp
      </div>
    </div>
  );
};

type ExonBlockProps = {
  exon: {
    start: number;
    end: number;
  };
  className?: string;
  scale: ScaleLinear<number, number>;
};

const ExonBlock = (props: ExonBlockProps) => {
  const { exon, scale } = props;
  const y = 8;
  const exonClasses = classNames(styles.exon, props.className);

  return (
    <g>
      <rect
        key={exon.start}
        className={exonClasses}
        y={y}
        height={EXON_HEIGHT}
        x={scale(exon.start)}
        width={scale(exon.end - exon.start + 1)}
      />
    </g>
  );
};

export default ExonsImage;
