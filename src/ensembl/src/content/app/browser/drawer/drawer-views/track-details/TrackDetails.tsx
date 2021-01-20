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

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getActiveTrackDetails } from 'src/content/app/browser/drawer/drawerSelectors';
import { fetchTrackDetails } from 'src/content/app/browser/drawer/drawerActions';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import styles from './TrackDetails.scss';

const TrackDetails = () => {
  const trackDetails = useSelector(getActiveTrackDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!trackDetails) {
      dispatch(fetchTrackDetails());
    }
  }, [trackDetails]);

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

      {(trackDetails.shared_description ||
        trackDetails.specific_description) && (
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>
            <div>{trackDetails.shared_description || null}</div>
            <div>{trackDetails.specific_description || null}</div>
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
