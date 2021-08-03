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
import { connect } from 'react-redux';

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

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import RadioGroup, {
  OptionValue,
  RadioOptions
} from 'ensemblRoot/src/shared/components/radio-group/RadioGroup';

import { RootState } from 'src/store';
import { CogList } from '../browserState';

import styles from './BrowserTrackConfig.scss';

export type BrowserTrackConfigProps = {
  applyToAll: boolean;
  browserCogTrackList: CogList;
  selectedCog: string | null;
  trackConfigLabel: { [key: string]: boolean };
  trackConfigNames: { [key: string]: boolean };
  updateApplyToAll: (yn: boolean) => void;
  updateTrackConfigLabel: (selectedCog: string, sense: boolean) => void;
  updateTrackConfigNames: (selectedCog: string, sense: boolean) => void;
  onClose: () => void;
};

export const BrowserTrackConfig = (props: BrowserTrackConfigProps) => {
  const {
    applyToAll,
    browserCogTrackList,
    trackConfigNames,
    trackConfigLabel
  } = props;

  const selectedCog = props.selectedCog || '';

  const shouldShowTrackName = trackConfigNames[selectedCog] || false;
  const shouldShowTrackLabels =
    selectedCog in trackConfigLabel ? trackConfigLabel[selectedCog] : true;

  const toggleName = useCallback(() => {
    if (applyToAll) {
      Object.keys(browserCogTrackList).forEach((name) => {
        props.updateTrackConfigNames(name, !shouldShowTrackName);
      });
    } else {
      props.updateTrackConfigNames(selectedCog, !shouldShowTrackName);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'track_name_' + (shouldShowTrackName ? 'off' : 'on')
    });
  }, [
    selectedCog,
    props.updateTrackConfigNames,
    shouldShowTrackName,
    applyToAll,
    browserCogTrackList
  ]);

  const toggleLabel = useCallback(() => {
    if (applyToAll) {
      Object.keys(browserCogTrackList).forEach((name) => {
        props.updateTrackConfigLabel(name, !shouldShowTrackLabels);
      });
    } else {
      props.updateTrackConfigLabel(selectedCog, !shouldShowTrackLabels);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (shouldShowTrackLabels ? 'off' : 'on')
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
      props.updateApplyToAll(value === 'all_tracks');

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

const mapStateToProps = (state: RootState) => ({
  applyToAll: getApplyToAll(state),
  browserCogTrackList: getBrowserCogTrackList(state),
  selectedCog: getBrowserSelectedCog(state),
  trackConfigLabel: getTrackConfigLabel(state),
  trackConfigNames: getTrackConfigNames(state)
});

const mapDispatchToProps = {
  updateApplyToAll,
  updateTrackConfigLabel,
  updateTrackConfigNames
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserTrackConfig);
