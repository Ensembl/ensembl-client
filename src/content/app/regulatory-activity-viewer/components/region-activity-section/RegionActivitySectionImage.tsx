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

import { scaleLinear } from 'd3';

import RegionDetailImage from './region-detail-image/RegionDetailImage';

import {
  GENE_TRACKS_TOP_OFFSET,
  GENE_TRACK_HEIGHT,
  REGULATORY_FEATURE_TRACKS_TOP_OFFSET,
  REGULATORY_FEATURE_TRACK_HEIGHT
} from './region-detail-image/regionDetailConstants';

import type { FeatureTracks } from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionActivitySection.module.css';

/**
 * This is an svg image that contains a magnified view of a selection within the overview image,
 * as well as an image of (epi)genomic activity.
 */

type Props = {
  width: number;
  regionOverviewData: OverviewRegion;
  featureTracks: FeatureTracks;
  start: number;
  end: number;
};

const RegionActivitySectionImage = (props: Props) => {
  const { width, regionOverviewData, featureTracks, start, end } = props;

  const scale = scaleLinear()
    .domain([start, end])
    .rangeRound([0, Math.floor(width)]);

  const height =
    GENE_TRACKS_TOP_OFFSET +
    (featureTracks.geneTracks.forwardStrandTracks.length +
      featureTracks.geneTracks.reverseStrandTracks.length) *
      GENE_TRACK_HEIGHT +
    REGULATORY_FEATURE_TRACKS_TOP_OFFSET +
    featureTracks.regulatoryFeatureTracks.length *
      REGULATORY_FEATURE_TRACK_HEIGHT +
    50;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={styles.middleColumnImage}
      style={{ border: '1px dotted black' }}
    >
      <RegionDetailImage
        data={regionOverviewData}
        featureTracks={featureTracks}
        scale={scale}
        width={width}
        start={start}
        end={end}
      />
    </svg>
  );
};

export default RegionActivitySectionImage;
