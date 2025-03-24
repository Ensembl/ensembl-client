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
import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppSelector } from 'src/store';

import prepareFeatureTracks from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import { fetchRegionDetails } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

import calculateRequestLocation from 'src/content/app/regulatory-activity-viewer/components/region-overview/calculateRequestLocation';

import { getRegionDetailSelectedLocation } from 'src/content/app/regulatory-activity-viewer/state/region-detail/regionDetaillSelectors';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
// import {
//   useRegionOverviewQuery,
//   stringifyLocation
// } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useRegionOverviewData from 'src/content/app/regulatory-activity-viewer/services/region-data-service/test-component/useRegionOverviewData';

import RegionOverviewImage, {
  getImageHeightAndTopOffsets
} from './region-overview-image/RegionOverviewImage';
import RegionOverviewZoomButtons from './region-overview-zoom-buttons/RegionOverviewZoomButtons';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { GenePopupMessage } from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/activityViewerPopupMessageTypes';
import type { RegionData } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/test-component/useRegionOverviewData';

import styles from './RegionOverview.module.css';

/**
 * NOTES
 * Distances:
 *  - Distance from the image to the left border and the the right border seems to be 150px
 *    => This means that the toggling of the sidebar will result in re-rendering of everything
 */

/**
 * Locations that we need to consider:
 *  - Viewport location
 *  - Should be able to drag viewport contents left and right
 *    - Render excessively: current viewport, plus full viewport to the left and to the right
 *    - If data for three viewports hasn't loaded yet, show a spinner?
 *  - Re-render full image every time user either releases the dragged region, or presses the button?
 */

const RegionOverview = () => {
  const {
    activeGenomeId,
    assemblyName,
    location,
    genomeIdForUrl,
    locationForUrl,
    focusGeneId
  } = useActivityViewerIds();
  const [width, setWidth] = useState(0);
  const regionDetailLocation = useAppSelector((state) =>
    getRegionDetailSelectedLocation(state, activeGenomeId ?? '')
  );
  const navigate = useNavigate();

  const { data: karyotype } = useGenomeKaryotypeQuery(activeGenomeId ?? '', {
    skip: !activeGenomeId
  });

  const regionOverviewDataParams =
    assemblyName && location
      ? {
          assemblyName,
          regionName: location.regionName,
          start: location.start,
          end: location.end
        }
      : null;

  const { data: currentData } = useRegionOverviewData(regionOverviewDataParams);

  useEffect(() => {
    if (!location || !assemblyName || !karyotype) {
      return;
    }
    // FIXME: also check latest requested location perhaps?
    // or should this be done at the region data service level?

    const { regionName, start, end } = location;
    const regionInKaryotype = karyotype.find(
      (region) => region.name === regionName
    );

    if (!regionInKaryotype) {
      // something has gone wrong; bail
      return;
    }

    const regionLength = regionInKaryotype.length;

    const regionDataRequestParams = calculateRequestLocation({
      assemblyName,
      regionName,
      start,
      end,
      regionLength
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyName, karyotype, location]);

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

  const onFocusGeneChange = (event: Event) => {
    if (!genomeIdForUrl || !locationForUrl) {
      // this should never happen; but will keep typescript happy
      return;
    }

    const gene = (event as CustomEvent).detail as GenePopupMessage['content'];

    const newUrl = urlFor.regulatoryActivityViewer({
      genomeId: genomeIdForUrl,
      location: locationForUrl,
      focusGeneId: gene.unversioned_stable_id
    });
    navigate(newUrl);
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
  data: RegionData;
  topOffsets: ReturnType<typeof getImageHeightAndTopOffsets>;
}) => {
  const { data, topOffsets } = props;
  const { strandDividerTopOffset, regulatoryFeatureTracksTopOffset } =
    topOffsets;

  const {
    region: { name: regionName, coordinate_system }
  } = data;

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
        {coordinate_system} {regionName}
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
