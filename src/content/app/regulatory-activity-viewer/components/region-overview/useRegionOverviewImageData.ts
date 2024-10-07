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

import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

/**
 * The purpose of this function is to group the region overview data into tracks.
 * Note that the elements outside of the RegionOverviewImage will need to be aware about the number of the tracks
 * for appropriate positioning next to the image (see e.g. the "Regulatory features" label)
 *
 * For regulatory features
 *  - distribute between three tracks
 *    - promoters and enhancers at the top
 *    - open chromatin in the middle
 *    - CTCF-binding sites in the bottom
 */

type InputData = Pick<
  OverviewRegion,
  'locations' | 'genes' | 'regulatory_features'
>;

type Params = {
  data: InputData | null;
};

// TODO: delete?

const useRegionOverviewImageData = (params: Params) => {
  const { data } = params;

  if (!data) {
    return {
      data: null
    };
  }

  const regulatoryFeatureTracks = buildRegulatoryFeatureTracks(data);

  return {
    regulatoryFeatureTracks
  };
};

const buildRegulatoryFeatureTracks = (input: NonNullable<Params['data']>) => {
  const regFeatureTracks: RegulatoryFeature[][] = [];
  const track1: RegulatoryFeature[] = [];
  const track2: RegulatoryFeature[] = [];
  const track3: RegulatoryFeature[] = [];

  const { regulatory_features } = input;
  for (const feature of regulatory_features) {
    if (['enhancer', 'promoter'].includes(feature.feature_type)) {
      track1.push(feature);
    } else if (feature.feature_type === 'open_chromatin_region') {
      track2.push(feature);
    } else {
      track3.push(feature);
    }
  }

  [track1, track2, track3].forEach((track) => {
    if (track.length) {
      regFeatureTracks.push(track);
    }
  });

  return regFeatureTracks;
};

export default useRegionOverviewImageData;
