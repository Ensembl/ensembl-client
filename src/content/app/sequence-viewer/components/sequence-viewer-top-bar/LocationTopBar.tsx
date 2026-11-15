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

import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import LocationSearch from 'src/content/app/sequence-viewer/components/location-search/LocationSearch';

import styles from './SequenceViewerTopBar.module.css';

const LocationTopBar = () => {
  const { genomeId, genomeIdForUrl, parsedFocusObjectId } =
    useSequenceViewerIds();
  const navigate = useNavigate();

  let parsedLocation: GenomicLocation | null = null;
  try {
    if (parsedFocusObjectId?.objectId) {
      parsedLocation = getGenomicLocationFromString(
        parsedFocusObjectId?.objectId
      );
    }
  } catch {
    // Invalid locations cannot be used to fetch sequence options.
  }

  if (!genomeId || !parsedLocation) {
    return null;
  }

  const formattedLocationString = getFormattedLocation({
    chromosome: parsedLocation.regionName,
    start: parsedLocation.start,
    end: parsedLocation.end
  });

  const onLocationChange = (nextLocation: string) => {
    navigate(
      urlFor.sequenceViewer({
        genomeId: genomeIdForUrl,
        focusObject: buildFocusIdForUrl({
          type: 'location',
          objectId: nextLocation
        })
      })
    );
  };

  return (
    <>
      <div className={`${styles.focusWrapper} ${styles.locationFocus}`}>
        <div className={styles.labelGroup}>
          <span className={styles.label}>Location</span>
          <span>{formattedLocationString}</span>
        </div>
      </div>
      <div className={styles.rightCorner}>
        <LocationSearch
          genomeId={genomeId}
          variety="compact"
          location={parsedLocation}
          onChange={onLocationChange}
        />
      </div>
    </>
  );
};

export default LocationTopBar;
