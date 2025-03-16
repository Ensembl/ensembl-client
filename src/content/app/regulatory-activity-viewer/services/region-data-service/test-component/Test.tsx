import { useEffect } from 'react';

import {
  fetchRegionDetails,
  BIN_SIZE
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

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
    if (!location || !assemblyName || !karyotype ) {
      return
    }
    // FIXME: also check latest requested location perhaps?
    // or should this be done at the region data service level?

    const { regionName, start, end } = location;
    const regionInKaryotype = karyotype.find((region) => region.name === regionName);

    if (!regionInKaryotype) {
      // something has gone wrong; bail
      return
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
  }, [
    assemblyName,
    karyotype,
    location
  ]);


  return (
    <div>
      Hello?
    </div>
  );
};

const calculateLocationToRequest = ({
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
  const lowerBinStart = Math.max(Math.floor(start / BIN_SIZE) * BIN_SIZE, 1);
  const upperBinEnd = Math.min(Math.ceil(end / BIN_SIZE) * BIN_SIZE, regionLength);

  return {
    assemblyName,
    regionName,
    start: lowerBinStart,
    end: upperBinEnd
  };
};


export default TestComponent;
