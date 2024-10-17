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

import { useState, useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames';

import prepareFeatureTracks from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';

import { useRegionOverviewQuery } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import RegionActivitySectionImage from './RegionActivitySectionImage';

// FIXME: promote these styles to the top level of region activity viewer
import regionOverviewStyles from '../region-overview/RegionOverview.module.css';
import styles from './RegionActivitySection.module.css';

/**
 * TODO: the name of this component should probably change.
 * It will contain the "magnified region image", but also
 * the actual activity heatmap.
 *
 * TODO: This component will need to know the start and the end locations
 * of the magnified segment. It will receive those either from the parent,
 * or (more likely) from redux
 */

const RegionActivitySection = () => {
  // TODO: think about how best to handle width changes; maybe they should come from the parent
  const [width, setWidth] = useState(0);
  const { currentData } = useRegionOverviewQuery();

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // TODO: width should be recalculated on resize
  // Consider if this is appropriate component for doing this.
  useEffect(() => {
    const imageContainer = imageContainerRef.current as HTMLDivElement;
    const { width: imageContainerWidth } =
      imageContainer.getBoundingClientRect();
    setWidth(imageContainerWidth);
  }, []);

  const preparedData = useMemo(() => {
    if (!currentData) {
      return null;
    }

    // let's consider just a single contiguous slice without "boring" intervals
    const location = currentData.locations[0];

    // TODO: below are hard-coded start and end of the selected segment of the region.
    // When the selection element is implemented, the selected start and end will come from user selection, probably via redux
    const locationLength = location.end - location.start + 1;
    const selectedStart = location.start + Math.round(0.2 * locationLength);
    const selectedEnd = location.start + Math.round(0.4 * locationLength);

    const featureTracks = prepareFeatureTracks({
      data: currentData,
      start: selectedStart,
      end: selectedEnd
    });
    return {
      featureTracks,
      start: selectedStart,
      end: selectedEnd
    };
  }, [currentData]);

  const componentClasses = classNames(
    styles.section,
    regionOverviewStyles.grid
  );

  return (
    <div className={componentClasses}>
      <div
        className={regionOverviewStyles.middleColumn}
        ref={imageContainerRef}
      >
        {currentData && preparedData && width && (
          <RegionActivitySectionImage
            width={width}
            regionOverviewData={currentData}
            featureTracks={preparedData.featureTracks}
            start={preparedData.start}
            end={preparedData.end}
          />
        )}
      </div>
    </div>
  );
};

export default RegionActivitySection;
