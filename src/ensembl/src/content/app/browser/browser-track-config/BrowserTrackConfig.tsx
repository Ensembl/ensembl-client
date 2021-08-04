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

import React, { useCallback, useRef } from 'react';
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

import useOutsideClick from 'src/shared/hooks/useOutsideClick';
import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import { browserTrackConfig } from '../browserConfig';

import { RootState } from 'src/store';
import { CogList } from '../browserState';
import { Status } from 'src/shared/types/status';
import { OutgoingActionType } from 'ensemblRoot/src/shared/types/genome-browser/genomeBrowser';

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

  const ref = useRef(null);

  const { genomeBrowser } = useGenomeBrowser();

  useOutsideClick(ref, props.onClose);

  const toggleName = useCallback(() => {
    const tracksToUpdate = [];
    if (applyToAll) {
      Object.keys(browserCogTrackList).forEach((name) => {
        props.updateTrackConfigNames(name, !shouldShowTrackName);
        tracksToUpdate.push(name);
      });
    } else {
      props.updateTrackConfigNames(selectedCog, !shouldShowTrackName);
      tracksToUpdate.push(selectedCog);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'track_name_' + (shouldShowTrackName ? 'off' : 'on')
    });

    genomeBrowser?.send({
      type: shouldShowTrackLabels
        ? OutgoingActionType.TURN_ON_LABELS
        : OutgoingActionType.TURN_OFF_LABELS,
      payload: {
        track_ids: tracksToUpdate
      }
    });
  }, [
    selectedCog,
    props.updateTrackConfigNames,
    shouldShowTrackName,
    applyToAll,
    browserCogTrackList
  ]);

  const toggleLabel = useCallback(() => {
    const tracksToUpdate = [];

    if (applyToAll) {
      Object.keys(browserCogTrackList).forEach((name) => {
        props.updateTrackConfigLabel(name, !shouldShowTrackLabels);
        tracksToUpdate.push(name);
      });
    } else {
      props.updateTrackConfigLabel(selectedCog, !shouldShowTrackLabels);
      tracksToUpdate.push(selectedCog);
    }

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'feature_label_' + (shouldShowTrackLabels ? 'off' : 'on')
    });

    genomeBrowser?.send({
      type: shouldShowTrackLabels
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

  const applyToAllToggle = useCallback(() => {
    props.updateApplyToAll(!applyToAll);

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'apply_to_all - ' + (applyToAll ? 'unselected' : 'selected')
    });
  }, [applyToAll, updateApplyToAll]);

  return (
    <div className={styles.trackConfig} ref={ref}>
      <div className={styles.section}>
        <Checkbox
          label="All tracks"
          checked={applyToAll}
          onChange={applyToAllToggle}
          classNames={{ checkboxHolder: styles.checkboxHolder }}
        />
      </div>
      <div className={styles.section}>
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
        <div className={styles.trackHeightIcon}>
          <ImageButton
            status={Status.DISABLED}
            image={browserTrackConfig.trackHeightIcon.icon}
            description={browserTrackConfig.trackHeightIcon.description}
          />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.trackLockIcon}>
          <ImageButton
            status={Status.DISABLED}
            image={browserTrackConfig.trackLockIcon.icon}
            description={browserTrackConfig.trackLockIcon.description}
          />
        </div>
        <div className={styles.trackHighlightIcon}>
          <ImageButton
            status={Status.DISABLED}
            image={browserTrackConfig.trackHighlightIcon.icon}
            description={browserTrackConfig.trackHighlightIcon.description}
          />
        </div>
        <div className={styles.trackMoveIcon}>
          <ImageButton
            status={Status.DISABLED}
            image={browserTrackConfig.trackMoveIcon.icon}
            description={browserTrackConfig.trackMoveIcon.description}
          />
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
