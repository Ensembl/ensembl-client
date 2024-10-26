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

import {
  REGULATORY_FEATURE_CORE_HEIGHT,
  REGULATORY_FEATURE_EXTENT_HEIGHT
} from 'src/content/app/regulatory-activity-viewer/components/region-activity-section/region-detail-image/regionDetailConstants';

import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type Props = {
  feature: RegulatoryFeature;
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
};

const RegionDetailRegulatoryFeature = (props: Props) => {
  return (
    <g>
      <BoundsRegion {...props} side="left" />
      <CoreRegion {...props} />
      <BoundsRegion {...props} side="right" />
    </g>
  );
};

const CoreRegion = (props: Props) => {
  const { scale, feature, featureTypesMap, offsetTop } = props;

  const x1 = scale(feature.start);
  const x2 = scale(feature.end);
  const width = x2 - x1;
  const color = featureTypesMap[feature.feature_type].color;

  if (!width) {
    return null;
  }

  return (
    <rect
      x={x1}
      width={width}
      y={offsetTop}
      height={REGULATORY_FEATURE_CORE_HEIGHT}
      fill={color}
    />
  );
};

const BoundsRegion = (props: Props & { side: 'left' | 'right' }) => {
  const { scale, feature, featureTypesMap, offsetTop, side } = props;

  const extentCoordinate =
    side === 'left' ? feature.extended_start : feature.extended_end;
  const isExtentSameAsCore =
    side === 'left'
      ? extentCoordinate === feature.start
      : extentCoordinate === feature.end;

  if (!extentCoordinate || isExtentSameAsCore) {
    return null;
  }

  const extentX = scale(extentCoordinate);
  const width =
    side === 'left'
      ? scale(feature.start) - extentX
      : extentX - scale(feature.end);
  const start = side === 'left' ? extentX : scale(feature.end);
  const color = featureTypesMap[feature.feature_type].color;

  if (width <= 0) {
    return null;
  }

  return (
    <rect
      x={start}
      width={width}
      y={offsetTop + REGULATORY_FEATURE_CORE_HEIGHT / 4}
      height={REGULATORY_FEATURE_EXTENT_HEIGHT}
      fill={color}
    />
  );
};

export default RegionDetailRegulatoryFeature;
