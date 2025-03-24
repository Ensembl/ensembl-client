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

const calculateRequestLocation = ({
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

  // FIXME:
  // Question 1 - should this request fetch data for three viewports?
  return {
    assemblyName,
    regionName,
    start: getBinStartForPosition(start),
    end: Math.min(getBinEndForPosition(end), regionLength)
  };
};

export default calculateRequestLocation;
