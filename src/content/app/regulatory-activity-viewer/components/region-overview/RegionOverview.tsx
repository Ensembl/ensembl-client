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

import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import prepareFeatureTracks from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import { fetchRegionDetails } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

import {
  getGreedyLocation,
  calculateRequestLocation
} from 'src/content/app/regulatory-activity-viewer/components/region-overview/calculateRequestLocation';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
// import {
//   useRegionOverviewQuery,
//   stringifyLocation
// } from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useRegionOverviewData, {
  type RegionData
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/test-component/useRegionOverviewData';

import RegionOverviewImage, {
  getImageHeightAndTopOffsets
} from './region-overview-image/RegionOverviewImage';
import RegionOverviewZoomButtons from './region-overview-zoom-buttons/RegionOverviewZoomButtons';
import { CircleLoader } from 'src/shared/components/loader';

import type { GenePopupMessage } from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/activityViewerPopupMessageTypes';

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
 *
 * TODO:
 *  - remove calls for region data
 *  - fix zoom buttons
 *  - change gene rendering at 1MB and up
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
  const navigate = useNavigate();

  const { data: karyotype } = useGenomeKaryotypeQuery(activeGenomeId ?? '', {
    skip: !activeGenomeId
  });

  const regionLength = useMemo(() => {
    if (!karyotype || !location) {
      return null;
    }

    const regionInKaryotype = karyotype.find(
      (region) => region.name === location.regionName
    );

    if (!regionInKaryotype) {
      // something went wrong
      return null;
    }

    return regionInKaryotype.length;
  }, [karyotype]);

  const extendedLocation = useMemo(() => {
    if (!location || !regionLength) {
      return null;
    }
    return getGreedyLocation({ ...location, regionLength });
  }, [location, regionLength]);

  const regionOverviewDataParams =
    assemblyName && location && extendedLocation
      ? {
          assemblyName,
          regionName: location.regionName,
          start: extendedLocation.start,
          end: extendedLocation.end
        }
      : null;

  const { data: currentData } = useRegionOverviewData(regionOverviewDataParams);
  const deferredData = useDeferredValue(currentData);

  useEffect(() => {
    if (!extendedLocation || !assemblyName || !regionLength) {
      return;
    }
    // FIXME: also check latest requested location perhaps?
    // or should this be done at the region data service level?

    const regionDataRequestParams = calculateRequestLocation({
      ...extendedLocation,
      assemblyName,
      regionLength
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyName, location, regionLength, extendedLocation]);

  // fetch data for full region data
  useEffect(() => {
    if (!location?.regionName || !assemblyName || !regionLength) {
      return;
    }

    const { regionName } = location;

    const regionDataRequestParams = calculateRequestLocation({
      assemblyName,
      regionLength,
      regionName,
      start: 1,
      end: regionLength
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyName, location?.regionName, regionLength]);

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
    return deferredData ? prepareFeatureTracks({ data: deferredData }) : null;
  }, [deferredData]);

  const topOffsets = featureTracks
    ? getImageHeightAndTopOffsets(featureTracks)
    : null;

  if (!activeGenomeId) {
    return null;
  }

  const isPending = deferredData !== currentData;

  return (
    <div className={styles.grid}>
      <div className={styles.leftColumn}>
        {deferredData && topOffsets && (
          <LeftColumn data={deferredData} topOffsets={topOffsets} />
        )}
      </div>
      <div className={styles.middleColumn} ref={onImageContainerMount}>
        <div className={styles.imageContainer}>
          {location &&
            extendedLocation &&
            deferredData &&
            featureTracks &&
            width && (
              <RegionOverviewImage
                activeGenomeId={activeGenomeId}
                data={deferredData}
                featureTracks={featureTracks}
                focusGeneId={focusGeneId}
                width={width}
                location={location}
                extendedLocation={extendedLocation}
              />
            )}
          {isPending && (
            <div className={styles.loader}>
              <CircleLoader />
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightColumn}>
        {location && regionLength && (
          <RegionOverviewZoomButtons
            genomeId={activeGenomeId}
            location={location}
            regionLength={regionLength}
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
