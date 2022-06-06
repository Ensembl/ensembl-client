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

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

import { useAppSelector, type RootState } from 'src/store';
import {
  getBrowserSelectedCog,
  getTrackConfigForTrackId
} from 'src/content/app/genome-browser/state/track-config/trackConfigSelectors';

import useBrowserTrackConfig from '../useBrowserTrackConfig';

import { TrackType } from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

import styles from '../BrowserTrackConfig.scss';

export const TranscriptTrackConfig = () => {
  const selectedCog = useAppSelector(getBrowserSelectedCog) || '';
  const selectedTrackConfigInfo = useAppSelector((state: RootState) =>
    getTrackConfigForTrackId(state, selectedCog)
  );
  const shouldShowTrackName = selectedTrackConfigInfo?.showTrackName ?? false;
  const shouldShowTrackLabel =
    selectedTrackConfigInfo?.trackType === TrackType.GENE &&
    selectedTrackConfigInfo.showFeatureLabel;

  const { updateTrackName, updateTrackLabel } = useBrowserTrackConfig();

  return (
    <div className={styles.section}>
      <div className={styles.subLabel}>Show</div>
      <div>
        <div className={styles.toggleWrapper}>
          <label>Track name</label>
          <SlideToggle
            isOn={shouldShowTrackName}
            onChange={() => updateTrackName(!shouldShowTrackName)}
            className={styles.slideToggle}
          />
        </div>
        <div className={styles.toggleWrapper}>
          <label>Feature labels</label>
          <SlideToggle
            isOn={shouldShowTrackLabel}
            onChange={() => updateTrackLabel(!shouldShowTrackLabel)}
            className={styles.slideToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptTrackConfig;
