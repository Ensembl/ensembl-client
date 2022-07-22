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

import { useAppSelector, type RootState } from 'src/store';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import GlobalTrackSwitch from './components/global-track-switch/GlobalTrackSwitch';

import { type GeneTrackSettings as GeneTrackSettingsType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import {
  getApplyToAllSettings,
  getBrowserSelectedCog,
  getTrackSettingsForTrackId
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import useTrackSettings from '../useTrackSettings';

import styles from '../TrackSettingsPanel.scss';

export const GeneTrackSettings = () => {
  const selectedCog = useAppSelector(getBrowserSelectedCog) || '';
  const selectedTrackSettings = useAppSelector(
    (state: RootState) =>
      getTrackSettingsForTrackId(
        state,
        selectedCog
      ) as GeneTrackSettingsType | null
  );

  const {
    updateTrackName,
    updateFeatureLabelsVisibility,
    updateShowSeveralTranscripts,
    updateShowTranscriptIds
  } = useTrackSettings();

  const shouldApplyToAll = useAppSelector(getApplyToAllSettings);
  const { toggleApplyToAll } = useTrackSettings();

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
        <GlobalTrackSwitch
          onChange={toggleApplyToAll}
          selectedOption={shouldApplyToAll ? 'all_tracks' : 'this_track'}
        />
      </div>
      <div className={styles.section}>
        <div className={styles.subLabel}>Show</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>5 transcripts</label>
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
          <div className={styles.toggleWrapper}>
            <label>Track name</label>
            <SlideToggle
              isOn={shouldShowTrackName}
              onChange={handleTrackNameToggle}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Feature labels</label>
            <SlideToggle
              isOn={shouldShowFeatureLabels}
              onChange={handleFeatureLabelsToggle}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneTrackSettings;
