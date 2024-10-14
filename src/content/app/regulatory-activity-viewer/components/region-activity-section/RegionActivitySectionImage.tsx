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

import RegionMagnifiedImage from './region-magnified-image/RegionMagnifiedImage';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionActivitySection.module.css';

/**
 * This is an svg image that contains a magnified view of a selection within the overview image,
 * as well as an image of (epi)genomic activity.
 */

type Props = {
  width: number;
  regionOverviewData: OverviewRegion;
};

const RegionActivitySectionImage = (props: Props) => {
  const { width, regionOverviewData } = props;

  const location = regionOverviewData.locations[0]; // let's consider just a single contiguous slice without "boring" intervals

  // TODO: selected start and end will later come from user selection, probably via redux
  const locationLength = location.end - location.start + 1;
  const selectedStart = location.start + Math.round(0.2 * locationLength);
  const selectedEnd = location.start + Math.round(0.4 * locationLength);

  const scale = scaleLinear()
    .domain([selectedStart, selectedEnd])
    .rangeRound([0, Math.floor(width)]);

  // FIXME: height should be calculated from data (the number of tracks)
  const height = 500;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={styles.middleColumnImage}
      style={{ border: '1px dotted black' }}
    >
      <RegionMagnifiedImage
        data={regionOverviewData}
        scale={scale}
        width={width}
        start={selectedStart}
        end={selectedEnd}
      />
    </svg>
  );
};

export default RegionActivitySectionImage;
