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

import {
  useState,
  useEffect,
  useMemo,
  useDeferredValue,
  useTransition
} from 'react';
import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import prepareFeatureTracks from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import { fetchRegionDetails } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

import {
  getGreedyLocation,
  calculateRequestLocation
} from 'src/content/app/regulatory-activity-viewer/components/region-overview/calculateRequestLocation';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useRegionOverviewData, {
  type RegionData
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/useRegionOverviewData';

import RegionOverviewImage, {
  getImageHeightAndTopOffsets
} from './region-overview-image/RegionOverviewImage';
import RegionOverviewZoomButtons from './region-overview-zoom-buttons/RegionOverviewZoomButtons';

import type { GenePopupMessage } from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/activityViewerPopupMessageTypes';

import styles from './RegionOverview.module.css';

const RegionOverview = () => {
  const {
    activeGenomeId,
    assemblyAccessionId,
    location,
    genomeIdForUrl,
    locationForUrl,
    focusGeneId
  } = useActivityViewerIds();
  const [, startWidthTransition] = useTransition();
  const [width, setWidth] = useState(0);
  const navigate = useNavigate();

  const extendedLocation = useMemo(() => {
    if (!location) {
      return null;
    }
    return getGreedyLocation({ ...location });
  }, [location]);

  const regionOverviewDataParams =
    assemblyAccessionId && location && extendedLocation
      ? {
          assemblyId: assemblyAccessionId,
          regionName: location.regionName,
          start: extendedLocation.start,
          end: extendedLocation.end
        }
      : null;

  const { data: currentData } = useRegionOverviewData(regionOverviewDataParams);
  const deferredData = useDeferredValue(currentData);
  const regionName = location?.regionName;
  const regionLength = currentData?.region.length;

  if (regionLength && extendedLocation) {
    extendedLocation.end = Math.min(extendedLocation?.end, regionLength);
  }

  useEffect(() => {
    if (!extendedLocation || !assemblyAccessionId) {
      return;
    }

    const regionDataRequestParams = calculateRequestLocation({
      ...extendedLocation,
      assemblyId: assemblyAccessionId
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyAccessionId, location, extendedLocation]);

  // fetch data for the whole region
  useEffect(() => {
    if (!assemblyAccessionId || !regionName || !regionLength) {
      return;
    }

    const regionDataRequestParams = calculateRequestLocation({
      assemblyId: assemblyAccessionId,
      regionName,
      start: 1,
      end: regionLength
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyAccessionId, regionName, regionLength]);

  const onImageContainerMount = (element: HTMLDivElement) => {
    const resizeObserver = new ResizeObserver((entries) => {
      const [imageContainer] = entries;
      const { width: imageContainerWidth } = imageContainer.contentRect;
      startWidthTransition(() => {
        setWidth(imageContainerWidth);
      });
    });

    resizeObserver.observe(element);

    // TODO: change to a more appropriate way of changing focus gene id
    document.addEventListener('focus-gene', onFocusGeneChange);

    return () => {
      document.removeEventListener('focus-gene', onFocusGeneChange);
      resizeObserver.disconnect();
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
          right: '16px',
          transform: 'translateY(-50%)'
        }}
      >
        {coordinate_system} {regionName}
      </div>
      <div
        style={{
          position: 'absolute',
          top: `${regulatoryFeatureTracksTopOffset}px`,
          right: '16px',
          transform: 'translateY(-50%)'
        }}
      >
        Regulatory features
      </div>
    </>
  );
};

export default RegionOverview;
