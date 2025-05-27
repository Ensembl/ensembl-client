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

import { useState, useRef, useTransition, memo } from 'react';
import classNames from 'classnames';

import { MAX_SLICE_LENGTH_FOR_DETAILED_VIEW } from 'src/content/app/regulatory-activity-viewer/constants/activityViewerConstants';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';
import useRegionActivityData from './useRegionActivityData';
import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';

import EpigenomeActivityImage from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/EpigenomesActivityImage';
import GeneExpressionLevels from 'src/content/app/regulatory-activity-viewer/components/gene-expression-levels/GeneExpressionLevels';
import EpigenomeLabels from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/epigenomes-sorter/EpigenomeLabels';
import EpigenomesTable from './epigenomes-table/EpigenomesTable';
import { CircleLoader } from 'src/shared/components/loader';

// FIXME: promote these styles to the top level of region activity viewer
import regionOverviewStyles from '../region-overview/RegionOverview.module.css';
import styles from './RegionActivitySection.module.css';

const RegionActivitySectionWrapper = () => {
  const { location } = useActivityViewerIds();

  if (!location) {
    return null;
  }

  const sliceSize = location.end - location.start + 1;

  if (sliceSize > MAX_SLICE_LENGTH_FOR_DETAILED_VIEW) {
    return <div>Please zoom in to view the details</div>;
  }

  return <RegionActivitySection />;
};

const RegionActivitySection = () => {
  const [isComponentTransitionPending, startTransition] = useTransition();
  const [width, setWidth] = useState(0);
  const {
    sortedCombinedEpigenomes,
    epigenomeSortingDimensions,
    epigenomeMetadataDimensionsResponse
  } = useEpigenomes();

  const imageContainerWidthRef = useRef(width);

  // update ref at every re-render
  imageContainerWidthRef.current = width;

  const onImageContainerMount = (element: HTMLDivElement) => {
    const resizeObserver = new ResizeObserver((entries) => {
      const [imageContainer] = entries;
      const { width: imageContainerWidth } = imageContainer.contentRect;
      if (imageContainerWidth !== imageContainerWidthRef.current) {
        startTransition(() => {
          setWidth(imageContainerWidth);
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  };

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

  const isPending =
    isLoading || isTransitionPending || isComponentTransitionPending;

  return (
    <div className={componentClasses}>
      <div className={regionOverviewStyles.middleColumn}>
        {isPending && (
          <div className={styles.loader}>
            <CircleLoader />
          </div>
        )}
      </div>
      <div
        className={classNames(
          regionOverviewStyles.leftColumn,
          styles.positionRelative
        )}
      >
        <EpigenomesTable />
        {preparedData && epigenomeMetadataDimensionsResponse && (
          <EpigenomeLabels
            epigenomes={sortedCombinedEpigenomes ?? []}
            sortingDimensions={epigenomeSortingDimensions ?? []}
            displayDimensions={
              epigenomeMetadataDimensionsResponse.ui_spec.table_layout
            }
            allDimensions={epigenomeMetadataDimensionsResponse.dimensions}
          />
        )}
      </div>
      <div
        className={regionOverviewStyles.middleColumn}
        ref={onImageContainerMount}
        style={isPending ? { visibility: 'hidden' } : {}}
      >
        {preparedData && width && (
          <EpigenomeActivityImage
            data={preparedData.epigenomeActivityData}
            scale={preparedData.scale}
            width={width}
          />
        )}
      </div>
      <div className={regionOverviewStyles.rightColumn}>
        {preparedData && <GeneExpressionLevels />}
      </div>
    </div>
  );
};

export default memo(RegionActivitySectionWrapper);
