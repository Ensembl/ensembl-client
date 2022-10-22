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
import { scaleLinear, interpolateRound, type ScaleLinear } from 'd3';

import type {
  BlastHit,
  BlastJobResult
} from 'src/content/app/tools/blast/types/blastJob';

import styles from './BlastGenomicHitsDiagram.scss';

type HitLocation = {
  start: number;
  end: number;
};

type Props = {
  job: BlastJobResult;
  width: number;
  regionName: string; // name of the genomic region (chromosome) that the heatmap is built for
  topHits?: HitLocation[];
};

// 12px font; 7 px small circle; 13px large circle => 25px height

const LABEL_HEIGHT = 10;
const LABEL_TO_BACKBONE_DISTANCE = 7;
const TOP_HIT_MARK_RADIUS = 6.5;
const HIT_MARK_RADIUS = 3.5;
const BACKBONE_HEIGHT = 1;

const BACKBONE_Y = LABEL_HEIGHT + LABEL_TO_BACKBONE_DISTANCE;

const ELEMENT_HEIGHT =
  LABEL_HEIGHT + LABEL_TO_BACKBONE_DISTANCE + TOP_HIT_MARK_RADIUS;

const BlastGenomicRegionHeatmap = (props: Props) => {
  const { width, job, regionName } = props;
  const region = job.hits.find((hit) => hit.hit_acc === regionName) as BlastHit;
  const regionLength = region.hit_len;

  const scale = scaleLinear()
    .domain([1, regionLength])
    .range([1, width])
    .interpolate(interpolateRound)
    .clamp(true);

  // return JSON.stringify(props);
  //  <rect x={0} y={0} width={width} height={ELEMENT_HEIGHT} />

  return (
    <svg
      width={width}
      viewBox={`0 0 ${width} ${ELEMENT_HEIGHT}`}
      overflow="visible"
    >
      <RegionName name={regionName} />
      <Backbone width={width} />
      <Hits matches={region.hit_hsps} scale={scale} />
      {props.topHits?.length && (
        <TopHits locations={props.topHits} scale={scale} />
      )}
    </svg>
  );
};

const RegionName = (props: { name: string }) => {
  return (
    <text x={0} y={LABEL_HEIGHT} className={styles.regionName}>
      {props.name}
    </text>
  );
};

const Backbone = (props: { width: number }) => {
  const { width } = props;
  return (
    <rect
      x={0}
      y={BACKBONE_Y}
      className={styles.backbone}
      width={width}
      height={BACKBONE_HEIGHT}
    />
  );
};

const Hits = (props: {
  matches: BlastHit['hit_hsps'];
  scale: ScaleLinear<number, number>;
}) => {
  return (
    <g>
      {props.matches.map((match, index) => (
        <circle
          key={index}
          cx={calculateCircleX({
            matchStart: Math.min(match.hsp_hit_from, match.hsp_hit_to),
            matchEnd: Math.max(match.hsp_hit_from, match.hsp_hit_to),
            scale: props.scale
          })}
          cy={BACKBONE_Y + 0.5}
          r={HIT_MARK_RADIUS}
          className={styles.hit}
        />
      ))}
    </g>
  );
};

const TopHits = (props: {
  locations: { start: number; end: number }[];
  scale: ScaleLinear<number, number>;
}) => {
  return (
    <g>
      {props.locations.map((location, index) => (
        <circle
          key={index}
          cx={calculateCircleX({
            matchStart: location.start,
            matchEnd: location.end,
            scale: props.scale
          })}
          cy={BACKBONE_Y + 0.5}
          r={TOP_HIT_MARK_RADIUS}
          className={styles.topHit}
        />
      ))}
    </g>
  );
};

const calculateCircleX = (params: {
  matchStart: number;
  matchEnd: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { matchStart, matchEnd, scale } = params;
  const matchMidpoint = matchStart + (matchEnd - matchStart) / 2;
  return scale(matchMidpoint);
};

export default BlastGenomicRegionHeatmap;
