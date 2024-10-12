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

import { type ScaleLinear } from 'd3';

import { GeneInRegionOverview } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

/**
 * A transcription start site is represented by an L-shaped arrow,
 * whose stem starts in the same track as the gene it is related to,
 * and ascends (in the forward strand) or descends (in the reverse strand)
 * into a separate track.
 *
 * The data from the api will contain several genomic positions for the TSS.
 * It isn't yet clear how best to visually represent this; and whether it is
 * even worth representing, or it is sufficient to pick just one position from the array.
 *
 */

const HORIZONTAL_ARM_LENGTH = 12;
const ARROWHEAD_BASE_LENGTH = 8; // the base of the triangle that represents the arrowhead
const ARROWHEAD_HEIGHT = 10; // the height of the triangle that represents the arrowhead
const COLOR = 'black';

type Props = {
  yStart: number;
  yEnd: number;
  tss: GeneInRegionOverview['tss']; // an array of genomic coordinates related to this transcription start site
  strand: 'forward' | 'reverse';
  scale: ScaleLinear<number, number>;
};

const TranscriptionStartSite = (props: Props) => {
  const { yStart, yEnd, tss, strand, scale } = props;

  const stemX = scale(tss[0].position);
  const armEndX =
    strand === 'forward'
      ? stemX + HORIZONTAL_ARM_LENGTH
      : stemX - HORIZONTAL_ARM_LENGTH;
  const arrowheadPointX =
    strand === 'forward'
      ? armEndX + ARROWHEAD_HEIGHT
      : armEndX - ARROWHEAD_HEIGHT;

  const arrowheadBaseBottomCoords = `${armEndX}, ${yEnd - ARROWHEAD_BASE_LENGTH / 2}`;
  const arrowheadBaseTopCoords = `${armEndX}, ${yEnd + ARROWHEAD_BASE_LENGTH / 2}`;
  const arrowheadPointCoords = `${arrowheadPointX}, ${yEnd}`;

  const labelX =
    strand === 'forward' ? arrowheadPointX + 8 : arrowheadPointX - 8;
  const labelY = yEnd;
  const textAnchor = strand === 'forward' ? 'start' : 'end';

  return (
    <g data-name="transcription start site">
      <line
        x1={stemX}
        x2={stemX}
        y1={yStart}
        y2={yEnd}
        stroke={COLOR}
        strokeWidth="1"
      />
      <line
        x1={stemX}
        x2={armEndX}
        y1={yEnd}
        y2={yEnd}
        stroke={COLOR}
        strokeWidth="1"
      />
      <polygon
        points={`${arrowheadBaseBottomCoords} ${arrowheadPointCoords} ${arrowheadBaseTopCoords}`}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        alignmentBaseline="middle"
        style={{
          fontSize: '11px',
          fontStyle: 'italic',
          fontWeight: 300,
          fontFamily:
            'Lato, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif'
        }}
      >
        Transcription start
      </text>
    </g>
  );
};

export default TranscriptionStartSite;
