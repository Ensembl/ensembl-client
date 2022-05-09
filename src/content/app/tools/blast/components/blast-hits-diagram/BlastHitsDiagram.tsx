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

// type Props = {
//   queryLength: number;
//   queryMatchedRegions: { start: number, end: number }[]
// };

const BLOCK_HEIGHT = 8;

type Props = {
  job: BlastJob;
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
      height={BLOCK_HEIGHT}
      viewBox={`0 0 ${width} ${BLOCK_HEIGHT}`}
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
  return <rect width={width} height={1} />;
};

const MatchedRegion = (props: {
  scale: ScaleLinear<number, number>;
  start: number;
  end: number;
}) => {
  const { scale, start, end } = props;
  const x = scale(start);
  const width = scale(end - start + 1);

  return <rect x={x} width={width} height={BLOCK_HEIGHT} />;
};

const getMatchedRegions = (job: BlastJob) => {
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
      const lastRegion = accumulator.at(-1) as { start: number; end: number }; // FIXME: will this work in Safari?

      if (region.start <= lastRegion.end) {
        lastRegion.end = Math.max(region.end, lastRegion.end);
      } else {
        accumulator.push(region);
      }

      return accumulator;
    },
    [] as { start: number; end: number }[]
  );
};

// FIXME: move this to a types file
type BlastJob = {
  query_len: number;
  hits: Array<{
    hit_id: string;
    hit_hsps: Array<{
      hsp_score: number;
      hsp_expect: number;
      hsp_align_len: number;
      hsp_identity: number;
      hsp_strand: string;
      hsp_query_from: number;
      hsp_query_to: number;
      hsp_hit_from: number;
      hsp_hit_to: number;
      hsp_qseq: string; // alignment string for the query (with gaps)
      hsp_mseq: string; // line of characters for showing matches between the query and the hit
      hsp_hseq: string; // alignment string for subject (with gaps)
    }>;
  }>;
};

export default BlastHitsDiagram;
