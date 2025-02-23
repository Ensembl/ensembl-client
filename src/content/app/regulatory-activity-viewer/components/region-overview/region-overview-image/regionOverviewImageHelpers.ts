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

import { scaleLinear, type ScaleLinear } from 'd3';

/**
 * Approach to rendering:
 * - The boundaries of the svg image represent a 'viewport'.
 *   It shows features either within a provided location (that is read from the url),
 *   or within a user-selected sub-location that is inside the provided location
 * - The approach involves painting all features within the location
 *   (there shouldn't be that many of them; so this operation should be reasonably inexpensive),
 *   and then shifting them horizontally (via transform translate)
 *   such that only the relevant features are visible in the viewport.
 *   The features that overflow the viewport should be hidden by default.
 *
 * A possible complication is the positioning of gene labels.
 * Ideally, they should start at the beginning of a feature;
 * but probably should not be rendered outside the viewport.
 */

export const getScaleForWholeLocation = ({
  location,
  detailLocation,
  viewportWidth
}: {
  location: { start: number; end: number };
  detailLocation: { start: number; end: number } | null;
  viewportWidth: number;
}) => {
  const fullGenomicDistance = location.end - location.start + 1;
  const detailGenomicDistance = detailLocation
    ? detailLocation.end - detailLocation.start + 1
    : fullGenomicDistance;

  // How much is full distance greater than detail distance
  const coefficient = fullGenomicDistance / detailGenomicDistance;
  const fullWidth = Math.floor(viewportWidth * coefficient);

  return scaleLinear()
    .domain([location.start, location.end])
    .rangeRound([0, fullWidth]);
};

export const getScaleForViewport = ({
  location,
  detailLocation,
  viewportWidth
}: {
  location: { start: number; end: number };
  detailLocation: { start: number; end: number } | null;
  viewportWidth: number;
}) => {
  const locationForScale = detailLocation ?? location;
  const { start: genomicStart, end: genomicEnd } = locationForScale;

  return scaleLinear()
    .domain([genomicStart, genomicEnd])
    .rangeRound([0, viewportWidth]);
};

/**
 * By how much to translate the features to the left,
 * so that the appropriate features are displayed in the viewport
 */
export const calculateShiftLeft = ({
  location,
  detailLocation,
  scale
}: {
  location: { start: number; end: number };
  detailLocation: { start: number; end: number } | null;
  scale: ScaleLinear<number, number>; // the scale for the whole location
}) => {
  const locationStart = location.start;
  const detailStart = detailLocation ? detailLocation.start : locationStart;

  const distance = detailStart - locationStart;

  return scale(locationStart + distance);
};

export const calculateLocationAfterDrag = ({
  location,
  detailLocation,
  scale,
  distance
}: {
  location: { start: number; end: number }; // location of the full region slice (can be larger than viewport)
  detailLocation: { start: number; end: number }; // location used for viewport
  scale: ScaleLinear<number, number>; // scale for the viewport
  distance: number; // distance the pointer moved, in pixels
}) => {
  const { start: minStart, end: maxEnd } = location;
  const { start, end } = detailLocation;
  const viewportDistance = end - start;

  const genomicDistanceDragged = getGenomicDistanceDragged({
    distance,
    scale
  });

  if (distance > 0) {
    // user dragged to the left
    if (start - genomicDistanceDragged >= minStart) {
      return {
        start: start - genomicDistanceDragged,
        end: end - genomicDistanceDragged
      };
    } else {
      // this shouldn't be possible; but putting a guard nonetheless
      return {
        start: minStart,
        end: minStart + viewportDistance
      };
    }
  } else {
    if (end + genomicDistanceDragged <= maxEnd) {
      return {
        start: start + genomicDistanceDragged,
        end: end + genomicDistanceDragged
      };
    } else {
      // this shouldn't be possible; but putting a guard nonetheless
      return {
        start: maxEnd - viewportDistance,
        end: maxEnd
      };
    }
  }
};

export const getGenomicDistanceDragged = ({
  distance,
  scale
}: {
  distance: number; // distance the pointer moved, in pixels
  scale: ScaleLinear<number, number>; // scale for viewport
}) => {
  // 2)

  // Translate absolute distance in pixels into base pairs
  // (note that this is translated into the domain that starts not from 0,
  // but from location start coordinate)
  const distanceToBasePairs = scale.invert(Math.abs(distance));

  // In order to calculate the actual distance in base pairs,
  // subtract the domain start from the previous value.
  const locationStart = scale.domain()[0];

  return Math.round(distanceToBasePairs - locationStart);
};
