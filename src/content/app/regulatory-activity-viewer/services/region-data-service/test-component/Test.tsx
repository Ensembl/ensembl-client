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

import { useEffect } from 'react';

import { fetchRegionDetails } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';
import {
  getBinStartForPosition,
  getBinEndForPosition
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/binsHelper';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useRegionOverviewData from './useRegionOverviewData';

/**
 * - Get the region name from the genomic location object
 * - Fetch karyotype
 * - Adjust location to the one we should fetch
 *  - At least 1MB
 *  - Not sure if need left/right
 *  - Should not extend beyond region end
 *  - Request full region immediately after
 *
 *
 */

const TestComponent = () => {
  const { activeGenomeId, assemblyName, location } = useActivityViewerIds();
  const { data: karyotype } = useGenomeKaryotypeQuery(activeGenomeId ?? '', {
    skip: !activeGenomeId
  });

  useEffect(() => {
    if (!location || !assemblyName || !karyotype) {
      return;
    }
    // FIXME: also check latest requested location perhaps?
    // or should this be done at the region data service level?

    const { regionName, start, end } = location;
    const regionInKaryotype = karyotype.find(
      (region) => region.name === regionName
    );

    if (!regionInKaryotype) {
      // something has gone wrong; bail
      return;
    }

    const regionLength = regionInKaryotype.length;

    const regionDataRequestParams = calculateLocationToRequest({
      assemblyName,
      regionName,
      start,
      end,
      regionLength
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyName, karyotype, location]);

  const regionOverviewDataParams =
    assemblyName && location
      ? {
          assemblyName,
          regionName: location.regionName,
          start: location.start,
          end: location.end
        }
      : null;

  useRegionOverviewData(regionOverviewDataParams);

  return <div>Hello?</div>;
};

const calculateLocationToRequest = ({
  assemblyName,
  regionName,
  start,
  end
  // regionLength
}: {
  assemblyName: string;
  regionName: string;
  start: number;
  end: number;
  regionLength: number;
}) => {
  // FIXME:
  // Question 1 - should this request fetch data for three viewports?
  // Question 2 - should there be a cutoff of the size of the slice
  //   at which point we should just request the whole region instead of bothering with requesting a slice?
  return {
    assemblyName,
    regionName,
    start: getBinStartForPosition(start),
    end: getBinEndForPosition(end)
  };
};

export default TestComponent;
