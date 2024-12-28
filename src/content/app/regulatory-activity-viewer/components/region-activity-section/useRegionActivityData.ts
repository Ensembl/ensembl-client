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

import { useState, useEffect, useTransition, useMemo } from 'react';
import { scaleLinear, type ScaleLinear } from 'd3';

import { useAppSelector } from 'src/store';

import { getRegionDetailSelectedLocation } from 'src/content/app/regulatory-activity-viewer/state/region-detail/regionDetaillSelectors';

import { useRegionOverviewQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';
import { useEpigenomesActivityQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import prepareFeatureTracks, {
  type FeatureTracks
} from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import {
  prepareActivityDataForDisplay,
  type EpigenomicActivityForDisplay
} from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/prepareActivityDataForDisplay';

/**
 * The purpose of this hook is to combine the preparation of the data
 * needed to render the RegionDetailImage and the EpigenomesActivityImage.
 *
 * Since the prepared data will result in a rendering of thousands (even tens of thousands)
 * of DOM elements, the hook also utilises React's useTransition hook.
 */

type RegionActivityData = {
  location: { start: number; end: number };
  featureTracksData: FeatureTracks;
  epigenomeActivityData: EpigenomicActivityForDisplay;
  scale: ScaleLinear<number, number>;
};

type Props = {
  width: number;
  genomeId: string;
};

const useRegionActivityData = (props: Props) => {
  const { width, genomeId } = props;
  const [isTransitionPending, startTransition] = useTransition();
  const [regionActivityData, setRegionActivityData] =
    useState<RegionActivityData | null>(null);
  const location = useRegionLocation({ genomeId });

  const {
    isLoading: isRegionFeatureDataLoading,
    currentData: regionFeaturesData
  } = useRegionOverviewQuery();
  const {
    isLoading: isEpigenomeActivityDataLoading,
    currentData: epigenomeActivityData
  } = useEpigenomesActivityQuery();

  useEffect(() => {
    if (!width || !location || !regionFeaturesData || !epigenomeActivityData) {
      return;
    }

    const scale = scaleLinear()
      .domain([location.start, location.end])
      .rangeRound([0, Math.floor(width)]);

    const featureTracksData = prepareFeatureTracks({
      data: regionFeaturesData,
      start: location.start,
      end: location.end
    });

    const preparedEpigenomeActivityData = prepareActivityDataForDisplay({
      data: epigenomeActivityData,
      location,
      scale
    });

    startTransition(() => {
      setRegionActivityData({
        location,
        scale,
        featureTracksData,
        epigenomeActivityData: preparedEpigenomeActivityData
      });
    });
  }, [width, location, regionFeaturesData, epigenomeActivityData]);

  return {
    data: regionActivityData,
    isLoading: isRegionFeatureDataLoading || isEpigenomeActivityDataLoading,
    isTransitionPending
  };
};

// If user has narrowed down the location within the region, use that.
// Otherwise, pick the location from the api response for the region.
const useRegionLocation = ({ genomeId }: { genomeId: string }) => {
  const regionDetailLocation = useAppSelector((state) =>
    getRegionDetailSelectedLocation(state, genomeId)
  );
  const { currentData } = useRegionOverviewQuery();

  return useMemo(() => {
    if (!currentData) {
      return null;
    }
    // let's consider just a single contiguous slice without "boring" intervals
    const location = currentData.locations[0];

    return {
      start: regionDetailLocation?.start ?? location.start,
      end: regionDetailLocation?.end ?? location.end
    };
  }, [currentData, regionDetailLocation]);
};

export default useRegionActivityData;
