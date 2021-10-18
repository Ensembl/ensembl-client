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

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  updateTrackConfigNames,
  updateTrackConfigLabel,
  updateApplyToAll
} from '../browserActions';

import {
  getTrackConfigNames,
  getTrackConfigLabel,
  getApplyToAll,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from '../browserSelectors';

import analyticsTracking from 'src/services/analytics-service';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import RadioGroup, {
  OptionValue,
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';
import { OutgoingActionType } from 'ensembl-genome-browser';

import styles from './BrowserTrackConfig.scss';

export const BrowserTrackConfig = () => {
  const applyToAll = useSelector(getApplyToAll);
  const browserCogTrackList = useSelector(getBrowserCogTrackList);
  const selectedCog = useSelector(getBrowserSelectedCog) || '';
  const trackConfigLabel = useSelector(getTrackConfigLabel);
  const trackConfigNames = useSelector(getTrackConfigNames);

  const dispatch = useDispatch();

  const shouldShowTrackName = trackConfigNames[selectedCog] || false;
  const shouldShowTrackLabels =
    selectedCog in trackConfigLabel ? trackConfigLabel[selectedCog] : true;

  const { genomeBrowser } = useGenomeBrowser();

  const toggleName = useCallback(() => {
    const tracksToUpdate = [];
    if (applyToAll) {
      Object.keys(browserCogTrackList).forEach((name) => {
        dispatch(updateTrackConfigNames(name, !shouldShowTrackName));
        tracksToUpdate.push(name);
      });
    } else {
      dispatch(updateTrackConfigNames(selectedCog, !shouldShowTrackName));
      tracksToUpdate.push(selectedCog);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'track_name_' + (shouldShowTrackName ? 'off' : 'on')
    });

    genomeBrowser?.send({
      type: !shouldShowTrackName
        ? OutgoingActionType.TURN_ON_NAMES
        : OutgoingActionType.TURN_OFF_NAMES,
      payload: {
        track_ids: tracksToUpdate
      }
    });
  }, [
    selectedCog,
    updateTrackConfigNames,
    shouldShowTrackName,
    applyToAll,
    browserCogTrackList
  ]);

  const toggleLabel = useCallback(() => {
    const tracksToUpdate = [];

    if (applyToAll) {
      Object.keys(browserCogTrackList).forEach((name) => {
        dispatch(updateTrackConfigLabel(name, !shouldShowTrackLabels));
        tracksToUpdate.push(name);
      });
    } else {
      dispatch(updateTrackConfigLabel(selectedCog, !shouldShowTrackLabels));
      tracksToUpdate.push(selectedCog);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (shouldShowTrackLabels ? 'off' : 'on')
    });

    genomeBrowser?.send({
      type: !shouldShowTrackLabels
        ? OutgoingActionType.TURN_ON_LABELS
        : OutgoingActionType.TURN_OFF_LABELS,
      payload: {
        track_ids: tracksToUpdate
      }
    });
  }, [
    selectedCog,
    updateTrackConfigLabel,
    shouldShowTrackLabels,
    applyToAll,
    browserCogTrackList
  ]);

  const handleRadioChange = useCallback(
    (value: OptionValue) => {
      dispatch(updateApplyToAll(value === 'all_tracks'));

      analyticsTracking.trackEvent({
        category: 'track_settings',
        label: selectedCog,
        action: 'apply_to_all - ' + (applyToAll ? 'unselected' : 'selected')
      });
    },
    [applyToAll, updateApplyToAll]
  );

  const radioOptions: RadioOptions = [
    {
      value: 'this_track',
      label: 'This track'
    },
    {
      value: 'all_tracks',
      label: 'All tracks'
    }
  ];

  return (
    <div className={styles.trackConfig}>
      <div className={styles.section}>
        <RadioGroup
          options={radioOptions}
          onChange={handleRadioChange}
          selectedOption={applyToAll ? 'all_tracks' : 'this_track'}
        />
      </div>
      <div className={styles.section}>
        <div className={styles.subLabel}>Show</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Track name</label>
            <SlideToggle
              isOn={shouldShowTrackName}
              onChange={toggleName}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Feature labels</label>
            <SlideToggle
              isOn={shouldShowTrackLabels}
              onChange={toggleLabel}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserTrackConfig;
