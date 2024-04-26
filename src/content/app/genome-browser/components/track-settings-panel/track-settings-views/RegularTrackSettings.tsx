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

import { forwardRef, type ForwardedRef } from 'react';

import { useAppSelector } from 'src/store';
import useTrackSettings from '../useTrackSettings';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

import { getTrackSettingsForTrackId } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import type { RegularTrackSettings as RegularTrackSettingsType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import ReorderTrack from 'static/icons/icon_move_tracks.svg';

import styles from '../TrackSettingsPanel.module.css';

type Props = {
  trackId: string;
};

export const RegularTrackSettings = (
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { trackId } = props;
  const trackSettings = useAppSelector((state) =>
    getTrackSettingsForTrackId(state, trackId)
  )?.settings as RegularTrackSettingsType;

  const { updateTrackSetting } = useTrackSettings({
    selectedTrackId: trackId
  });

  const shouldShowTrackName = trackSettings.name;

  const onTrackNameToggle = () => {
    updateTrackSetting('name', !shouldShowTrackName);
  };

  return (
    <div className={styles.trackSettingsPanel} ref={ref}>
      <div className={styles.section}>
        <div className={styles.subLabel}>All tracks</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Track name</label>
            <SlideToggle
              isOn={shouldShowTrackName}
              onChange={onTrackNameToggle}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.reorderTrack}>
          <ReorderTrack />
        </div>
      </div>
    </div>
  );
};

export default forwardRef(RegularTrackSettings);
