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

import {
  getBinStartForPosition,
  getBinEndForPosition
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/binsHelper';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

export const calculateRequestLocation = ({
  assemblyName,
  regionName,
  start,
  end,
  regionLength
}: {
  assemblyName: string;
  regionName: string;
  start: number;
  end: number;
  regionLength: number;
}) => {
  const sliceLength = end - start + 1;

  if (sliceLength / regionLength > 0.7) {
    // if the slice is longer than a certain fraction of the region (say, 70%),
    // then there is hardly any point in fetching them independently;
    // just fetch the full region instead
    start = 1;
    end = regionLength;
  }

  return {
    assemblyName,
    regionName,
    start: getBinStartForPosition(start),
    end: Math.min(getBinEndForPosition(end), regionLength)
  };
};

/**
 * Given the start and the end coordinates of a location,
 * request a larger location that continues upstream and downstream
 * by the same distance as the provided location itself
 * (thus, it is three times as large as the provided location).
 */
export const getGreedyLocation = ({
  regionName,
  start,
  end,
  regionLength
}: GenomicLocation & {
  regionLength: number;
}): GenomicLocation => {
  const sliceLength = end - start + 1;
  const newStart = Math.max(start - sliceLength, 1);
  const newEnd = Math.min(end + sliceLength, regionLength);

  return {
    regionName,
    start: newStart,
    end: newEnd
  };
};

export const calculateGreedyRequestLocation = ({
  assemblyName,
  regionName,
  start,
  end,
  regionLength
}: {
  assemblyName: string;
  regionName: string;
  start: number;
  end: number;
  regionLength: number;
}) => {
  const sliceLength = end - start + 1;
  const newStart = Math.max(start - sliceLength, 1);
  const newEnd = Math.min(end + sliceLength, regionLength);

  return calculateRequestLocation({
    assemblyName,
    regionName,
    start: newStart,
    end: newEnd,
    regionLength
  });
};
