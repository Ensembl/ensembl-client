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

import styles from './BrowserTrackConfig.scss';

import tracksSliderOnIcon from 'static/img/browser/icon_tracks_slider_on.svg';
import tracksSliderOffIcon from 'static/img/browser/icon_tracks_slider_off.svg';
import { RootState } from 'src/store';
import { CogList } from '../browserState';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import { browserTrackConfig } from '../browserConfig';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

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
  useOutsideClick(ref, props.onClose);

  const nameIcon = shouldShowTrackName
    ? tracksSliderOnIcon
    : tracksSliderOffIcon;
  const labelIcon =
    shouldShowTrackLabels !== false ? tracksSliderOnIcon : tracksSliderOffIcon;

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

  const applyToAllToggle = useCallback(() => {
    props.updateApplyToAll(!applyToAll);

    analyticsTracking.trackEvent({
      category: 'track_settings',
      label: selectedCog,
      action: 'apply_to_all - ' + (applyToAll ? 'unselected' : 'selected')
    });
  }, [applyToAll, updateApplyToAll]);

  const checkboxStyles = {
    checkboxHolder: styles.allTracks
  };

  return (
    <section className={styles.trackConfig} ref={ref}>
      <dl>
        <dd>
          <Checkbox
            classNames={checkboxStyles}
            label="All tracks"
            checked={applyToAll}
            onChange={applyToAllToggle}
          />
        </dd>
      </dl>
      <dl>
        <dd>
          <label htmlFor="trackConfig-trackName">Track name</label>
          <button
            className={`${styles.trackConfigSlider} trackConfig-trackName`}
            onClick={toggleName}
          >
            <img src={nameIcon} />
          </button>
        </dd>
        <dd>
          <label htmlFor="trackConfig-featureLabels">Feature labels</label>
          <button
            className={`${styles.trackConfigSlider} trackConfig-featureLabels`}
            onClick={toggleLabel}
          >
            <img src={labelIcon} />
          </button>
        </dd>
        <dd className={styles.heightSwitcher}>
          <div className={styles.trackHeightBtn}>
            <ImageButton
              buttonStatus={Status.INACTIVE}
              image={browserTrackConfig.trackHeightBtn.icon}
              description={browserTrackConfig.trackHeightBtn.description}
            />
          </div>
        </dd>
      </dl>
      <dl>
        <dd className={styles.trackLock}>
          <div className={styles.trackLockBtn}>
            <ImageButton
              buttonStatus={Status.INACTIVE}
              image={browserTrackConfig.trackLockBtn.icon}
              description={browserTrackConfig.trackLockBtn.description}
            />
          </div>
        </dd>
        <dd>
          <div className={styles.trackHighlightBtn}>
            <ImageButton
              buttonStatus={Status.INACTIVE}
              image={browserTrackConfig.trackHighlightBtn.icon}
              description={browserTrackConfig.trackHighlightBtn.description}
            />
          </div>
        </dd>
        <dd>
          <div className={styles.trackMoveBtn}>
            <ImageButton
              buttonStatus={Status.INACTIVE}
              image={browserTrackConfig.trackMoveBtn.icon}
              description={browserTrackConfig.trackMoveBtn.description}
            />
          </div>
        </dd>
      </dl>
    </section>
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
