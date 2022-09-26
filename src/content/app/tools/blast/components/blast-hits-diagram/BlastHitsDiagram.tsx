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

import type { BlastJobResult } from 'src/content/app/tools/blast/types/blastJob';

import styles from './BlastHitsDiagram.scss';

const BACKBONE_HEIGHT = 1;
const BLOCK_HEIGHT = 6;

type Props = {
  job: BlastJobResult;
  width: number;
};

const BlastHitsDiagram = (props: Props) => {
  const { job, width } = props;
  const queryLength = job.query_len;
  const queryMatchedRegions = getMatchedRegions(job);

  const scale = scaleLinear()
    .domain([1, queryLength])
    .range([1, width])
    .interpolate(interpolateRound)
    .clamp(true);

  return (
    <svg
      width={width}
      height={BLOCK_HEIGHT + BACKBONE_HEIGHT}
      viewBox={`0 0 ${width} ${BLOCK_HEIGHT + BACKBONE_HEIGHT}`}
    >
      <Backbone width={width} />
      {queryMatchedRegions.map((region, index) => (
        <MatchedRegion {...region} scale={scale} key={index} />
      ))}
    </svg>
  );
};

const Backbone = (props: { width: number }) => {
  const { width } = props;
  return (
    <rect className={styles.backbone} width={width} height={BACKBONE_HEIGHT} />
  );
};

const MatchedRegion = (props: {
  scale: ScaleLinear<number, number>;
  start: number;
  end: number;
}) => {
  const { scale, start, end } = props;
  const x = scale(start);
  const width = scale(end - start + 1);

  return (
    <rect
      className={styles.hit}
      x={x}
      y={BACKBONE_HEIGHT}
      width={width}
      height={BLOCK_HEIGHT}
    />
  );
};

const getMatchedRegions = (job: BlastJobResult) => {
  const queryMatchedRegions = job.hits
    .map((hit) =>
      hit.hit_hsps.map((hsp) => ({
        start: hsp.hsp_query_from,
        end: hsp.hsp_query_to
      }))
    )
    .flat();

  // sort by start location in ascending order
  const sortedMatchedRegions = queryMatchedRegions.sort((a, b) => {
    return a.start - b.start;
  });

  /**
   * Combine overlapping matches if there are any:
   *
   *    |-------|
   *          |------|
   *                 |-------|
   *                             |-------|
   *
   * should result in:
   *
   *    |--------------------|   |-------|
   *
   */
  return sortedMatchedRegions.reduce(
    (
      accumulator,
      region
    ): {
      start: number;
      end: number;
    }[] => {
      if (!accumulator.length) {
        return [region];
      }
      const previousRegion = accumulator.at(-1) as {
        start: number;
        end: number;
      }; // FIXME: will this work in Safari?

      if (region.start <= previousRegion.end) {
        previousRegion.end = Math.max(region.end, previousRegion.end);
      } else {
        accumulator.push(region);
      }

      return accumulator;
    },
    [] as { start: number; end: number }[]
  );
};

export default BlastHitsDiagram;
