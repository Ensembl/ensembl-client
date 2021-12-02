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
import { useDispatch, useSelector } from 'react-redux';
import { OutgoingActionType } from 'ensembl-genome-browser';

import {
  updateTrackConfigNames,
  updateTrackConfigLabel,
  updateApplyToAll,
  updateApplyToAllTrackLabels,
  updateApplyToAllTrackNames
} from 'src/content/app/genome-browser/state/browserActions';

import {
  getTrackConfigNames,
  getTrackConfigLabel,
  getApplyToAllConfig,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from 'src/content/app/genome-browser/state/browserSelectors';

import analyticsTracking from 'src/services/analytics-service';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import RadioGroup, {
  OptionValue,
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import styles from './BrowserTrackConfig.scss';

export const BrowserTrackConfig = () => {
  const applyToAllConfig = useSelector(getApplyToAllConfig);
  const browserCogTrackList = useSelector(getBrowserCogTrackList);
  const selectedCog = useSelector(getBrowserSelectedCog) || '';
  const trackConfigLabel = useSelector(getTrackConfigLabel);
  const trackConfigNames = useSelector(getTrackConfigNames);

  const dispatch = useDispatch();

  const shouldShowTrackName = trackConfigNames[selectedCog] || false;
  const shouldShowTrackLabels =
    selectedCog in trackConfigLabel ? trackConfigLabel[selectedCog] : true;

  const { genomeBrowser } = useGenomeBrowser();

  const updateName = (options: {
    isTrackNameShown: boolean;
    applyToAll: boolean;
  }) => {
    const { isTrackNameShown, applyToAll } = options;

    const tracksToUpdate = [];
    if (applyToAll) {
      dispatch(updateApplyToAllTrackNames(isTrackNameShown));

      Object.keys(browserCogTrackList).forEach((name) => {
        dispatch(updateTrackConfigNames(name, isTrackNameShown));
        tracksToUpdate.push(name);
      });
    } else {
      dispatch(updateTrackConfigNames(selectedCog, isTrackNameShown));
      tracksToUpdate.push(selectedCog);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'track_name_' + (isTrackNameShown ? 'on' : 'off')
    });

    genomeBrowser?.send({
      type: isTrackNameShown
        ? OutgoingActionType.TURN_ON_NAMES
        : OutgoingActionType.TURN_OFF_NAMES,
      payload: {
        track_ids: tracksToUpdate
      }
    });
  };

  const toggleName = () => {
    updateName({
      isTrackNameShown: !shouldShowTrackName,
      applyToAll: applyToAllConfig.isSelected
    });
  };

  const updateLabel = (options: {
    isTrackLabelsShown: boolean;
    applyToAll: boolean;
  }) => {
    const { isTrackLabelsShown, applyToAll } = options;

    const tracksToUpdate = [];

    if (applyToAll) {
      dispatch(updateApplyToAllTrackLabels(isTrackLabelsShown));

      Object.keys(browserCogTrackList).forEach((name) => {
        dispatch(updateTrackConfigLabel(name, isTrackLabelsShown));
        tracksToUpdate.push(name);
      });
    } else {
      dispatch(updateTrackConfigLabel(selectedCog, isTrackLabelsShown));
      tracksToUpdate.push(selectedCog);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (isTrackLabelsShown ? 'on' : 'off')
    });

    genomeBrowser?.send({
      type: isTrackLabelsShown
        ? OutgoingActionType.TURN_ON_LABELS
        : OutgoingActionType.TURN_OFF_LABELS,
      payload: {
        track_ids: tracksToUpdate
      }
    });
  };

  const toggleLabel = () => {
    updateLabel({
      isTrackLabelsShown: !shouldShowTrackLabels,
      applyToAll: applyToAllConfig.isSelected
    });
  };

  const handleRadioChange = (value: OptionValue) => {
    const shouldApplyToAll = value === 'all_tracks';

    dispatch(updateApplyToAll(shouldApplyToAll));

    updateName({
      isTrackNameShown: shouldShowTrackName,
      applyToAll: shouldApplyToAll
    });
    updateLabel({
      isTrackLabelsShown: shouldShowTrackLabels,
      applyToAll: shouldApplyToAll
    });

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action:
        'apply_to_all - ' +
        (applyToAllConfig.isSelected ? 'unselected' : 'selected')
    });
  };

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
          selectedOption={
            applyToAllConfig.isSelected ? 'all_tracks' : 'this_track'
          }
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
