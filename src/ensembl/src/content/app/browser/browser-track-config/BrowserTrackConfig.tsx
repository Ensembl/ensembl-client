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

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

import trackHeightBtn from 'static/img/browser/icon_tracks_height_grey.svg';
import trackLockBtn from 'static/img/browser/icon_tracks_lock_open_grey.svg';
import trackHighlightBtn from 'static/img/browser/icon_tracks_highlight_grey.svg';
import trackMoveBtn from 'static/img/browser/icon_tracks_move_grey.svg';
import { RootState } from 'src/store';
import { CogList } from '../browserState';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

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
          <label>Track name</label>
          <SlideToggle
            isOn={shouldShowTrackName}
            onChange={toggleName}
            className={styles.slideToggle}
          />
        </dd>
        <dd>
          <label>Feature labels</label>
          <SlideToggle
            isOn={shouldShowTrackLabels}
            onChange={toggleLabel}
            className={styles.slideToggle}
          />
        </dd>
        <dd className={styles.heightSwitcher}>
          <button className={styles.trackHeightBtn}>
            <img src={trackHeightBtn} />
          </button>
        </dd>
      </dl>
      <dl>
        <dd className={styles.trackLock}>
          <button className={styles.trackLockBtn}>
            <img src={trackLockBtn} />
          </button>
        </dd>
        <dd>
          <button className={styles.trackHighlightBtn}>
            <img src={trackHighlightBtn} />
          </button>
        </dd>
        <dd>
          <button className={styles.trackMoveBtn}>
            <img src={trackMoveBtn} />
          </button>
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
