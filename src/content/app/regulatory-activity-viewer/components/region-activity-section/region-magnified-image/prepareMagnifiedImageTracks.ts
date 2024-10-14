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

import type { ScaleLinear } from 'd3';

import prepareRegionOverviewGeneTracks from 'src/content/app/regulatory-activity-viewer/components/region-overview/prepareRegionOverviewGeneTracks';

import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type Params = {
  scale: ScaleLinear<number, number>;
  data: OverviewRegion;
  start: number;
  end: number;
};

/**
 * Tracks should probably be consistent with RegionOverviewImage.
 * NOTE: the number of tracks will define the height of the image;
 * so this function should probably be called by RegionActivitySectionImage
 *
 * NOTE: filter only the genes and regulatory features that exist
 * within the selected region
 */

const prepareMagnifiedImageTracks = (params: Params) => {
  const { start, end } = params;
  const filteredGenes = params.data.genes.filter((gene) => {
    return gene.start < end || gene.end > start;
  });
  const filteredRegulatoryFeatures =
    params.data.regulatory_features.data.filter((feature) => {
      return (
        (feature.extended_start && feature.extended_start < end) ||
        (feature.extended_end && feature.extended_end > start) ||
        feature.start < end ||
        feature.end > start
      );
    });

  const filteredData: typeof params.data = {
    ...params.data,
    genes: filteredGenes,
    regulatory_features: {
      ...params.data.regulatory_features,
      data: filteredRegulatoryFeatures
    }
  };

  const { geneTracks } = prepareRegionOverviewGeneTracks({
    ...params,
    data: filteredData
  });
  const regulatoryFeatureTracks = prepareRegulatoryFeatureTracks(params);

  return {
    geneTracks,
    regulatoryFeatureTracks
  };
};

const prepareRegulatoryFeatureTracks = (params: Params) => {
  const regulatoryFeaturesData = params.data.regulatory_features;
  const featureTypesMap = regulatoryFeaturesData.feature_types;
  const features = regulatoryFeaturesData.data;

  const featureTracks: RegulatoryFeature[][] = [];

  for (const feature of features) {
    const trackIndex = featureTypesMap[feature.feature_type]?.track_index;

    if (typeof trackIndex !== 'number') {
      // this should not happen
      continue;
    }

    const track = featureTracks[trackIndex];

    if (!track) {
      featureTracks[trackIndex] = [feature];
    } else {
      track.push(feature);
    }
  }

  // just in case: make sure there are no empty indexes in the tracks array
  return featureTracks.filter((item) => !!item);
};

export default prepareMagnifiedImageTracks;
