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

import { GeneTrackSettings as GeneTrackSettingsType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import ReorderTrack from 'static/icons/icon_move_tracks.svg';

import styles from '../TrackSettingsPanel.scss';

type Props = {
  trackId: string;
};

export const GeneTrackSettings = (props: Props) => {
  const { trackId } = props;
  const selectedTrackSettings = useAppSelector((state) =>
    getTrackSettingsForTrackId(state, trackId)
  )?.settings as GeneTrackSettingsType;

  const {
    updateTrackName,
    updateFeatureLabelsVisibility,
    updateShowSeveralTranscripts,
    updateShowTranscriptIds
  } = useTrackSettings({ selectedTrackId: trackId });

  if (!selectedTrackSettings) {
    return null;
  }

  const shouldShowTrackName = selectedTrackSettings.showTrackName;
  const shouldShowFeatureLabels = selectedTrackSettings.showFeatureLabels;
  const shouldShowSeveralTranscripts =
    selectedTrackSettings.showSeveralTranscripts;
  const shouldShowTranscriptIds = selectedTrackSettings.showTranscriptIds;

  const handleSeveralTranscriptsToggle = () => {
    updateShowSeveralTranscripts(!shouldShowSeveralTranscripts);
  };

  const handleTranscriptIdsToggle = () => {
    updateShowTranscriptIds(!shouldShowTranscriptIds);
  };

  const handleTrackNameToggle = () => {
    updateTrackName(!shouldShowTrackName);
  };

  const handleFeatureLabelsToggle = () => {
    updateFeatureLabelsVisibility(!shouldShowFeatureLabels);
  };

  return (
    <div className={styles.trackSettingsPanel}>
      <div className={styles.section}>
        <div className={styles.subLabel}>All genes</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>First 5 transcripts</label>
            <SlideToggle
              isOn={shouldShowSeveralTranscripts}
              onChange={handleSeveralTranscriptsToggle}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Transcript IDs</label>
            <SlideToggle
              isOn={shouldShowTranscriptIds}
              onChange={handleTranscriptIdsToggle}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.subLabel}>All tracks</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Feature labels</label>
            <SlideToggle
              isOn={shouldShowFeatureLabels}
              onChange={handleFeatureLabelsToggle}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Track name</label>
            <SlideToggle
              isOn={shouldShowTrackName}
              onChange={handleTrackNameToggle}
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

export default GeneTrackSettings;
