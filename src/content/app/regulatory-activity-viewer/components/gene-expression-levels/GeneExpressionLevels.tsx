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

import { memo } from 'react';

import { TRACK_HEIGHT } from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/epigenomeActivityImageConstants';
import {
  GENE_EXPRESSION_INDICATOR_HEIGHT,
  GENE_EXPRESSION_INDICATOR_WIDTH,
  TOTAL_WIDTH,
  DISTANCE_TO_LABEL,
  INDICATOR_OFFSET_TOP,
  GENE_EXPRESSION_INDICATOR_FONT_SIZE
} from './geneExpressionLevelConstants';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';
import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import { useEpigenomesGeneActivityQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

/**
 * This component displays gene expression levels,
 * and is only displayed when there is a focus gene.
 */

const GeneExpressionLevels = () => {
  const { sortedCombinedEpigenomes } = useEpigenomes();
  const { assemblyAccessionId, focusGeneId } = useActivityViewerIds();

  const epigenomeIds = sortedCombinedEpigenomes?.map(
    (epigenome) => epigenome.id
  );

  const { data } = useEpigenomesGeneActivityQuery(
    {
      assemblyAccessionId: assemblyAccessionId ?? '',
      geneId: focusGeneId ?? '',
      epigenomeIds: epigenomeIds ?? []
    },
    {
      skip: !assemblyAccessionId || !focusGeneId || !epigenomeIds
    }
  );

  if (!data) {
    return null;
  }

  const totalHeight = data.gene_activity.length * TRACK_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${TOTAL_WIDTH} ${totalHeight}`}
      style={{
        width: `${TOTAL_WIDTH}px`,
        height: `${totalHeight}px`,
        overflow: 'visible'
      }}
      width={TOTAL_WIDTH}
    >
      <Heading medianValue={data.median} />
      {data.gene_activity.map(({ epigenome_ids, value }, index) => {
        const id = epigenome_ids.join(', '); // FIXME: this should be a common function for generating combined epigenome id out of multiple base epigenome ids
        return (
          <GeneExpressionIndicator key={id} value={value} trackIndex={index} />
        );
      })}
      <MedianLine value={data.median} height={totalHeight} />
    </svg>
  );
};

// the value passed with props is between 0 and 1
const GeneExpressionIndicator = ({
  value,
  trackIndex
}: {
  value: number;
  trackIndex: number;
}) => {
  const darkRectWidth = Math.round(GENE_EXPRESSION_INDICATOR_WIDTH * value);
  const lightRectX = darkRectWidth;
  const lightRectWidth = GENE_EXPRESSION_INDICATOR_WIDTH - darkRectWidth;

  const trackOffsetTop = trackIndex * TRACK_HEIGHT;
  const indicatorOffsetTop = INDICATOR_OFFSET_TOP;

  const labelX = GENE_EXPRESSION_INDICATOR_WIDTH + DISTANCE_TO_LABEL;

  /**
   * the dark grey colour is the same as the --color-dark-grey CSS variable
   */

  return (
    <g transform={`translate(0, ${trackOffsetTop})`}>
      <rect
        x={0}
        y={indicatorOffsetTop}
        width={darkRectWidth}
        height={GENE_EXPRESSION_INDICATOR_HEIGHT}
        fill="#6f8190"
      />
      <rect
        x={lightRectX}
        y={indicatorOffsetTop}
        width={lightRectWidth}
        height={GENE_EXPRESSION_INDICATOR_HEIGHT}
        fill="#e9ecee"
      />
      <text
        x={labelX}
        y={indicatorOffsetTop + GENE_EXPRESSION_INDICATOR_FONT_SIZE / 2}
        style={{
          fontSize: `${GENE_EXPRESSION_INDICATOR_FONT_SIZE}px`,
          fontWeight: 300
        }}
      >
        {value}
      </text>
    </g>
  );
};

const MedianLine = ({ value, height }: { value: number; height: number }) => {
  const x = Math.round(GENE_EXPRESSION_INDICATOR_WIDTH * value);

  /**
   * the orange colour is the same as the --color-orange CSS variable
   */

  return (
    <line
      x1={x}
      x2={x}
      y1={0}
      y2={height}
      stroke="#ff9900"
      strokeDasharray="2"
    />
  );
};

const Heading = ({ medianValue }: { medianValue: number }) => {
  return (
    <g transform="translate(0, -30)" style={{ fontWeight: 300 }}>
      <text x={0} y={0}>
        Expression level
      </text>
      <text x={0} y={18} style={{ fontSize: '11px', whiteSpace: 'pre' }}>
        Median {'  '}
        <tspan style={{ fontWeight: 400 }}>{medianValue}</tspan>
      </text>
    </g>
  );
};

export default memo(GeneExpressionLevels);
