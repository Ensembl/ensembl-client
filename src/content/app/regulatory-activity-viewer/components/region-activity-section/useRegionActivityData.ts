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

import { useState, useEffect, useTransition } from 'react';
import { scaleLinear, type ScaleLinear } from 'd3';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';
import {
  useRegionOverviewQuery,
  stringifyLocation
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';
import { useEpigenomesActivityQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import {
  prepareActivityDataForDisplay,
  type EpigenomicActivityForDisplay
} from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/prepareActivityDataForDisplay';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

/**
 * The purpose of this hook is to combine the preparation of the data
 * needed to render the RegionDetailImage and the EpigenomesActivityImage.
 *
 * Since the prepared data will result in a rendering of thousands (even tens of thousands)
 * of DOM elements, the hook also utilises React's useTransition hook.
 */

type RegionActivityData = {
  location: { start: number; end: number };
  regionOverviewData: OverviewRegion;
  epigenomeActivityData: EpigenomicActivityForDisplay;
  scale: ScaleLinear<number, number>;
};

type Props = {
  width: number;
};

const useRegionActivityData = (props: Props) => {
  const { width } = props;
  const [isTransitionPending, startTransition] = useTransition();
  const [regionActivityData, setRegionActivityData] =
    useState<RegionActivityData | null>(null);
  const { assemblyName, assemblyAccessionId, location } =
    useActivityViewerIds();
  const { filteredCombinedEpigenomes, sortedCombinedEpigenomes } =
    useEpigenomes();

  const epigenomeIds = filteredCombinedEpigenomes?.map(
    (epigenome) => epigenome.id
  );

  const {
    isLoading: isRegionOverviewDataLoading,
    currentData: regionOverviewData
  } = useRegionOverviewQuery(
    {
      assemblyId: assemblyAccessionId || '',
      location: location ? stringifyLocation(location) : ''
    },
    {
      skip: !assemblyAccessionId || !location
    }
  );
  const {
    isLoading: isEpigenomeActivityDataLoading,
    currentData: epigenomeActivityData
  } = useEpigenomesActivityQuery(
    {
      assemblyId: assemblyAccessionId ?? '',
      epigenomeIds: epigenomeIds ?? [],
      regionName: location?.regionName ?? '',
      locations: location ? [{ start: location.start, end: location.end }] : []
    },
    {
      skip: !assemblyAccessionId || !epigenomeIds || !location
    }
  );

  useEffect(() => {
    if (!width || !location || !regionOverviewData || !epigenomeActivityData) {
      return;
    }

    const scale = scaleLinear()
      .domain([location.start, location.end])
      .rangeRound([0, Math.floor(width)]);

    const preparedEpigenomeActivityData = prepareActivityDataForDisplay({
      data: epigenomeActivityData,
      location,
      sortedEpigenomes: sortedCombinedEpigenomes ?? [],
      scale
    });

    startTransition(() => {
      setRegionActivityData({
        location,
        scale,
        regionOverviewData,
        epigenomeActivityData: preparedEpigenomeActivityData
      });
    });
  }, [
    width,
    location?.start,
    location?.end,
    regionOverviewData,
    epigenomeActivityData,
    sortedCombinedEpigenomes
  ]);

  return {
    data: regionActivityData,
    isLoading: isRegionOverviewDataLoading || isEpigenomeActivityDataLoading,
    isTransitionPending
  };
};

export default useRegionActivityData;
