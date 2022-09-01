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

import React from 'react';
import { useSelector } from 'react-redux';

import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import { trackDetailsSampleData } from '../../sampleData';

import type { GenericTrackView } from 'src/content/app/genome-browser/state/drawer/types';

import styles from './TrackDetails.scss';

type Props = {
  drawerView: GenericTrackView;
};

const TrackDetails = (props: Props) => {
  const { trackId } = props.drawerView;
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);

  const { currentData: genomeTrackCategories } = useGenomeTracksQuery(
    activeGenomeId ?? ''
  );

  if (!activeGenomeId || !genomeTrackCategories) {
    return null; // FIXME — maybe show a spinner?
  }

  // NOTE: fetching the data for all tracks to get the description of one track
  // is clearly unscalable; but doesn't matter while we still have a handful of tracks.
  // We will need to use a dedicated track api endpoint for a single track in the future.

  // eslint-disable-next-line
  const currentTrackData = genomeTrackCategories
    .flatMap(({ track_list }) => track_list)
    .find(({ track_id }) => track_id === props.drawerView.trackId);

  const trackDetails = trackDetailsSampleData[activeGenomeId][trackId] || null;

  if (!trackDetails) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          <span className={styles.trackName}>{trackDetails.track_name}</span>

          {trackDetails.strand && (
            <span className={styles.strand}>{trackDetails.strand} strand</span>
          )}
        </div>
      </div>

      {trackDetails.description && (
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>
            <div>{trackDetails.description || null}</div>
          </div>
        </div>
      )}

      {trackDetails.source && (
        <div className={styles.standardLabelValue}>
          <div className={styles.value}>
            <div>
              <ExternalLink
                to={trackDetails.source.url}
                linkText={trackDetails.source.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDetails;
