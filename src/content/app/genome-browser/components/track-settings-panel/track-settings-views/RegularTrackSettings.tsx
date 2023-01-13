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

import { useAppSelector } from 'src/store';
import useTrackSettings from '../useTrackSettings';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

import { getTrackSettingsForTrackId } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import type { RegularTrackSettings as RegularTrackSettingsType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import MoveTrackIcon from 'static/icons/icon_move_tracks.svg';

import styles from '../TrackSettingsPanel.scss';

type Props = {
  trackId: string;
};

export const RegularTrackSettings = (props: Props) => {
  const { trackId } = props;
  const trackSettings = useAppSelector((state) =>
    getTrackSettingsForTrackId(state, trackId)
  )?.settings as RegularTrackSettingsType;

  const { updateTrackName } = useTrackSettings({
    selectedTrackId: trackId
  });

  const shouldShowTrackName = trackSettings.showTrackName;

  return (
    <div className={styles.trackSettingsPanel}>
      <div className={styles.section}>
        <div className={styles.subLabel}>All tracks</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Track name</label>
            <SlideToggle
              isOn={shouldShowTrackName}
              onChange={() => updateTrackName(!shouldShowTrackName)}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.moveTracksIcon}>
          <MoveTrackIcon />
        </div>
      </div>
    </div>
  );
};

export default RegularTrackSettings;
