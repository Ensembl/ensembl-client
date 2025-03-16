import { useState, useEffect } from 'react';

import { regionDetailsState$ } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

const useRegionOverviewData = ({
  assemblyName,
  regionName,
  start,
  end
}: {
  assemblyName: string;
  regionName: string;
  start: number;
  end: number;
}) => {

  // useEffect(() => {
  //   regionDetailsState$.pipe
  // }, []);
};
