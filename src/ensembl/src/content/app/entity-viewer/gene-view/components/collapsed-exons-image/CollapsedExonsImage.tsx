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
import { getCodingExonsForImage } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from 'src/content/app/entity-viewer/gene-view/components/default-transcripts-list/DefaultTranscriptsList.scss';
import styles from './CollapsedExonsImage.scss';

const IMAGE_HEIGHT = 24;
const EXON_HEIGHT = 18;

type ExonsImageProps = {
  transcriptId: string;
  refSplicedRNALength: number;
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
      refSplicedRNALength={props.refSplicedRNALength}
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

  const nucleotidesPerPixel = props.refSplicedRNALength / props.width;
  const codingExons = getCodingExonsForImage(transcript, nucleotidesPerPixel);

  const shouldExonBlockHaveBorder = (index: number) =>
    index !== codingExons.length - 1;

  const scale = scaleLinear()
    .domain([1, props.refSplicedRNALength])
    .range([1, props.width])
    .clamp(true);

  const midStyles = classNames(transcriptsListStyles.middle, styles.middle);

  return (
    <div className={transcriptsListStyles.row}>
      <div className={transcriptsListStyles.left}>Protein sequence</div>
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
                hasBorder={shouldExonBlockHaveBorder(index)}
                className={props.className}
                scale={scale}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className={transcriptsListStyles.right}>
        {transcript.product?.stable_id}
      </div>
    </div>
  );
};

type ExonBlockProps = {
  exon: {
    start: number;
    end: number;
  };
  hasBorder?: boolean;
  className?: string;
  scale: ScaleLinear<number, number>;
};

const ExonBlock = (props: ExonBlockProps) => {
  const { exon, scale } = props;
  const y = 3;
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
      {props.hasBorder && (
        <rect
          key={exon.end + 1}
          className={styles.exonBorder}
          y={y}
          height={EXON_HEIGHT}
          x={scale(exon.end + 1)}
          width="1px"
        />
      )}
    </g>
  );
};

export default ExonsImage;
