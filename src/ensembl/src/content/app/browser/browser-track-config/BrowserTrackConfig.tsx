import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect
} from 'react';
import { connect } from 'react-redux';

import {
  updateTrackConfigNames,
  updateTrackConfigLabel
} from '../browserActions';

import { getTrackConfigNames, getTrackConfigLabel } from '../browserSelectors';

import styles from './BrowserTrackConfig.scss';

import tracksSliderOnIcon from 'static/img/browser/icon_tracks_slider_on.svg';
import tracksSliderOffIcon from 'static/img/browser/icon_tracks_slider_off.svg';
import trackHeightBtn from 'static/img/browser/icon_tracks_height_grey.svg';
import trackLockBtn from 'static/img/browser/icon_tracks_lock_open_grey.svg';
import trackHighlightBtn from 'static/img/browser/icon_tracks_highlight_grey.svg';
import trackMoveBtn from 'static/img/browser/icon_tracks_move_grey.svg';

type BrowserTrackConfigProps = {
  selectedCog: number | null;
  ypos: number;
  trackConfigName: boolean;
  trackConfigLabel: boolean;
};

const BrowserTrackConfig: FunctionComponent<BrowserTrackConfigProps> = (
  props: BrowserTrackConfigProps
) => {
  let inline = {
    top: props.ypos - 3 + 'px',
    right: '40px',
    position: 'absolute'
  };
  console.log('rerender');
  let {
    selectedCog,
    updateTrackConfigNames,
    updateTrackConfigLabel,
    trackConfigNames,
    trackConfigLabel
  } = props;

  let trackOurConfigName = trackConfigNames[selectedCog];
  let trackOurConfigLabel = trackConfigLabel[selectedCog];

  let nameIcon = trackOurConfigName ? tracksSliderOnIcon : tracksSliderOffIcon;
  let labelIcon = trackOurConfigLabel
    ? tracksSliderOnIcon
    : tracksSliderOffIcon;

  const toggleName = useCallback(() => {
    updateTrackConfigNames(selectedCog, !trackOurConfigName);
  }, [selectedCog, updateTrackConfigNames, trackOurConfigName]);

  const toggleLabel = useCallback(() => {
    updateTrackConfigLabel(selectedCog, !trackOurConfigLabel);
  }, [selectedCog, updateTrackConfigLabel, trackOurConfigLabel]);

  return (
    <div style={inline}>
      <section className={styles.trackConfig}>
        <dl className="category">
          <dd className={styles.allTracks}>
            <input type="checkbox" disabled />
            <label htmlFor="">All tracks</label>
          </dd>
        </dl>
        <dl className="category">
          <dd className="trackName">
            <label htmlFor="">Track name</label>
            <button className={styles.trackConfigSlider} onClick={toggleName}>
              <img src={nameIcon} />
            </button>
          </dd>
          <dd className="featureLabels">
            <label htmlFor="">Feature labels</label>
            <button className={styles.trackConfigSlider} onClick={toggleLabel}>
              <img src={labelIcon} />
            </button>
          </dd>
          <dd className={styles.heightSwitcher}>
            <button className={styles.trackHeightBtn}>
              <img src={trackHeightBtn} />
            </button>
          </dd>
        </dl>
        <dl className="category">
          <dd className={styles.trackLock}>
            <button className={styles.trackLockBtn}>
              <img src={trackLockBtn} />
            </button>
          </dd>
          <dd className="trackHighlight disabled">
            <button className={styles.trackHighlightBtn}>
              <img src={trackHighlightBtn} />
            </button>
          </dd>
          <dd className="trackMove disabled">
            <button className={styles.trackMoveBtn}>
              <img src={trackMoveBtn} />
            </button>
          </dd>
        </dl>
      </section>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  updateTrackConfigNames,
  updateTrackConfigLabel
};

const mapStateToProps = (state: RootState): StateProps => ({
  trackConfigNames: getTrackConfigNames(state),
  trackConfigLabel: getTrackConfigLabel(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserTrackConfig);
