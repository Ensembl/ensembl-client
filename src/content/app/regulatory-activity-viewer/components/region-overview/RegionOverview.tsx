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

import { useState, useEffect, useMemo } from 'react';

import { useAppSelector } from 'src/store';

import prepareFeatureTracks from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';

import { getRegionDetailSelectedLocation } from 'src/content/app/regulatory-activity-viewer/state/region-detail/regionDetaillSelectors';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import {
  useRegionOverviewQuery,
  stringifyLocation
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import RegionOverviewImage, {
  getImageHeightAndTopOffsets
} from './region-overview-image/RegionOverviewImage';
import RegionOverviewZoomButtons from './region-overview-zoom-buttons/RegionOverviewZoomButtons';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionOverview.module.css';

/**
 * NOTES
 * Distances:
 *  - Distance from the image to the left border and the the right border seems to be 150px
 *    => This means that the toggling of the sidebar will result in re-rendering of everything
 */

const RegionOverview = () => {
  const { activeGenomeId, assemblyName, location } = useActivityViewerIds();
  const [width, setWidth] = useState(0);
  // FIXME: this is temporary; focus can also be a regulatory feature; should probably be reflected in url, and should be set via redux
  const [focusGeneId, setFocusGeneId] = useState<string | null>(null);
  const regionDetailLocation = useAppSelector((state) =>
    getRegionDetailSelectedLocation(state, activeGenomeId ?? '')
  );
  const { currentData } = useRegionOverviewQuery(
    {
      assemblyName: assemblyName || '',
      location: location ? stringifyLocation(location) : ''
    },
    {
      skip: !assemblyName || !location
    }
  );

  // TODO: width should be recalculated on resize
  // Consider if this is appropriate component for doing this.
  const onImageContainerMount = (element: HTMLDivElement) => {
    const { width: imageContainerWidth } = element.getBoundingClientRect();
    setWidth(imageContainerWidth);

    // TODO: change to a more appropriate way of changing focus gene id
    document.addEventListener('focus-gene', onFocusGeneChange);

    return () => {
      document.removeEventListener('focus-gene', onFocusGeneChange);
    };
  };

  useEffect(() => {
    if (!currentData) {
      return;
    }

    const focusGeneIndex = currentData.selected_gene_index;
    const focusGeneId = currentData.genes[focusGeneIndex]?.stable_id;

    if (focusGeneId) {
      setFocusGeneId(focusGeneId);
    }
  }, [currentData]);

  const onFocusGeneChange = (event: Event) => {
    const newFocusGeneId = (event as CustomEvent).detail as string;
    setFocusGeneId(newFocusGeneId);
  };

  const featureTracks = useMemo(() => {
    return currentData ? prepareFeatureTracks({ data: currentData }) : null;
  }, [currentData]);

  const topOffsets = featureTracks
    ? getImageHeightAndTopOffsets(featureTracks)
    : null;

  if (!activeGenomeId) {
    return null;
  }

  return (
    <div className={styles.grid}>
      <div className={styles.leftColumn}>
        {currentData && topOffsets && (
          <LeftColumn data={currentData} topOffsets={topOffsets} />
        )}
      </div>
      <div className={styles.middleColumn} ref={onImageContainerMount}>
        {location && currentData && featureTracks && width && (
          <RegionOverviewImage
            activeGenomeId={activeGenomeId}
            data={currentData}
            featureTracks={featureTracks}
            focusGeneId={focusGeneId}
            width={width}
            location={location}
            regionDetailLocation={regionDetailLocation}
          />
        )}
      </div>
      <div className={styles.rightColumn}>
        {location && (
          <RegionOverviewZoomButtons
            genomeId={activeGenomeId}
            location={location}
            regionDetailLocation={regionDetailLocation}
          />
        )}
      </div>
    </div>
  );
};

const LeftColumn = (props: {
  data: OverviewRegion;
  topOffsets: ReturnType<typeof getImageHeightAndTopOffsets>;
}) => {
  const { data, topOffsets } = props;
  const { strandDividerTopOffset, regulatoryFeatureTracksTopOffset } =
    topOffsets;

  const { region_name, coordinate_system } = data;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: `${strandDividerTopOffset}px`,
          right: '10px',
          transform: 'translateY(-50%)'
        }}
      >
        {coordinate_system} {region_name}
      </div>
      <div
        style={{
          position: 'absolute',
          top: `${regulatoryFeatureTracksTopOffset}px`,
          right: '10px',
          transform: 'translateY(-50%)'
        }}
      >
        Regulatory features
      </div>
    </>
  );
};

export default RegionOverview;
