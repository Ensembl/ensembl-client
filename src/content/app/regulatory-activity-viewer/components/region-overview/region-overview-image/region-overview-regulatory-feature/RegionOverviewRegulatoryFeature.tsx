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

import type { MouseEvent } from 'react';
import type { ScaleLinear } from 'd3';

import {
  REGULATORY_FEATURE_CORE_HEIGHT,
  REGULATORY_FEATURE_EXTENT_HEIGHT
} from 'src/content/app/regulatory-activity-viewer/components/region-overview/region-overview-image/regionOverviewImageConstants';

import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { RegulatoryFeatureMessage } from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/activityViewerPopupMessageTypes';

import commonStyles from '../RegionOverviewImage.module.css';

type Props = {
  feature: RegulatoryFeature;
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  regionData: Pick<OverviewRegion, 'region_name'>;
  offsetTop: number;
  scale: ScaleLinear<number, number>;
};

const RegionOverviewRegulatoryFeature = (props: Props) => {
  const { feature, regionData } = props;

  const onClick = (event: MouseEvent<Element>) => {
    event.preventDefault();
    event.stopPropagation();

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const message: RegulatoryFeatureMessage = {
      type: 'regulatory-feature',
      coordinates: { x, y },
      content: {
        id: feature.id,
        feature_type: feature.feature_type,

        region_name: regionData.region_name,
        start: feature.start,
        end: feature.end,
        extended_start: feature.extended_start,
        extended_end: feature.extended_end
      }
    };

    const messageEvent = new CustomEvent('popup-message', {
      detail: message,
      bubbles: true
    });

    event.currentTarget.dispatchEvent(messageEvent);
  };

  return (
    <g className={commonStyles.interactiveArea} onClick={onClick}>
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
  const width = Math.max(x2 - x1, 2);
  const color = featureTypesMap[feature.feature_type].color;

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

export default RegionOverviewRegulatoryFeature;
