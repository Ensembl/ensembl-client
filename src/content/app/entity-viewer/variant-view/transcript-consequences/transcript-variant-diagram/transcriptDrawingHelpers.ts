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

import type { SplicedExon } from 'src/shared/types/core-api/exon';

import type { ScaleLinear } from 'd3';
import type { Pick2 } from 'ts-multipick';

type CalculateExonRectanglesParams = {
  spliced_exons: Pick2<SplicedExon, 'relative_location', 'start' | 'end'>[];
  cds?: {
    relative_start: number;
    relative_end: number;
  } | null;
  scale: ScaleLinear<number, number>;
};

const getLength = (start: number, end: number) => end - start + 1;

// FIXME: check if this module is needed

export const calculateExonRectangles = (
  params: CalculateExonRectanglesParams
) => {
  const { spliced_exons, cds, scale } = params;

  return spliced_exons.map((exon) => {
    const { start: exonStart, end: exonEnd } = exon.relative_location;
    const isCompletelyNonCoding =
      !cds || exonEnd < cds.relative_start || exonStart > cds.relative_end;
    const isNonCodingLeft =
      cds && exonStart < cds.relative_start && exonEnd > cds.relative_start;
    const isNonCodingRight =
      cds && exonStart < cds.relative_end && exonEnd > cds.relative_end;

    if (cds && isNonCodingLeft) {
      const nonCodingRect = {
        filled: false,
        x: scale(exonStart),
        width: scale(getLength(exonStart, cds.relative_start))
      };
      const codingRect = {
        filled: true,
        x: scale(cds.relative_start),
        width: scale(getLength(cds.relative_start, exonEnd))
      };
      return [nonCodingRect, codingRect];
    } else if (cds && isNonCodingRight) {
      const codingRect = {
        filled: true,
        x: scale(exonStart),
        width: scale(getLength(exonStart, cds.relative_end))
      };
      const nonCodingRect = {
        filled: false,
        x: scale(cds.relative_end),
        width: scale(getLength(cds.relative_end, exonEnd))
      };
      return [codingRect, nonCodingRect];
    } else {
      const rect = {
        filled: !isCompletelyNonCoding,
        x: scale(exonStart),
        width: scale(getLength(exonStart, exonEnd))
      };
      return [rect];
    }
  });
};

// d3 has an interpolator for rounding numbers to the neares integer (https://github.com/d3/d3-interpolate/blob/main/src/round.js)
// but does not seem to have an interpolator for always using the smallest integer
// so here's the custom one
// const interpolateFloor = (a: number, b: number) => (t: number) =>
//   Math.floor(a * (1 - t) + b * t);
