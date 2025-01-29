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

import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';
import useRegionActivityData from './useRegionActivityData';

import RegionActivitySectionImage from './RegionActivitySectionImage';
import EpigenomeActivityImage from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/EpigenomesActivityImage';
import EpigenomesSorter from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/epigenomes-sorter/EpigenomesSorter';
import { CircleLoader } from 'src/shared/components/loader';

// FIXME: promote these styles to the top level of region activity viewer
import regionOverviewStyles from '../region-overview/RegionOverview.module.css';
import styles from './RegionActivitySection.module.css';

const RegionActivitySection = () => {
  // TODO: think about how best to handle width changes; maybe they should come from the parent
  const [width, setWidth] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { sortedCombinedEpigenomes, epigenomeSortingDimensions } =
    useEpigenomes();

  // TODO: width should be recalculated on resize
  // Consider if this is appropriate component for doing this.
  useEffect(() => {
    const imageContainer = imageContainerRef.current as HTMLDivElement;
    const { width: imageContainerWidth } =
      imageContainer.getBoundingClientRect();
    setWidth(imageContainerWidth);
  }, []);

  const {
    data: preparedData,
    isLoading,
    isTransitionPending
  } = useRegionActivityData({
    width
  });

  const componentClasses = classNames(
    styles.section,
    regionOverviewStyles.grid
  );

  return (
    <div className={componentClasses}>
      <div>
        <EpigenomesSorter
          epigenomes={sortedCombinedEpigenomes ?? []}
          sortingDimensions={epigenomeSortingDimensions ?? []}
        />
      </div>
      <div
        className={regionOverviewStyles.middleColumn}
        ref={imageContainerRef}
      >
        <div className={styles.container}>
          {preparedData && width && (
            <>
              <RegionActivitySectionImage
                width={width}
                regionOverviewData={preparedData.regionOverviewData}
                featureTracks={preparedData.featureTracksData}
                start={preparedData.location.start}
                end={preparedData.location.end}
              />
              {/* A temporary vertical separator component below */}
              <div style={{ margin: '1rem 0' }} />
              <EpigenomeActivityImage
                data={preparedData.epigenomeActivityData}
                scale={preparedData.scale}
                width={width}
              />
            </>
          )}
          {(isLoading || isTransitionPending) && (
            <div className={styles.loader}>
              <CircleLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionActivitySection;
