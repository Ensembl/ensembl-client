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

import { getBrowserActiveGenomeId } from 'src/content/app/browser/browserSelectors';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import { trackDetailsSampleData } from '../../sampleData';

import { GenericTrackView } from 'src/content/app/browser/state/drawer/types';

import styles from './TrackDetails.scss';

type Props = {
  drawerView: GenericTrackView;
};

const TrackDetails = (props: Props) => {
  const {
    payload: { trackId }
  } = props.drawerView;
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);

  if (!activeGenomeId) {
    return null;
  }

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
