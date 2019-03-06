import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect
} from 'react';
import { connect } from 'react-redux';

import styles from './BrowserTrackConfig.scss';

import tracksSliderOnIcon from 'static/img/browser/icon_tracks_slider_on.svg';
import tracksSliderOffIcon from 'static/img/browser/icon_tracks_slider_off.svg';
import trackHeightBtn from 'static/img/browser/icon_tracks_height_grey.svg';
import trackLockBtn from 'static/img/browser/icon_tracks_lock_open_grey.svg';
import trackHighlightBtn from 'static/img/browser/icon_tracks_highlight_grey.svg';
import trackMoveBtn from 'static/img/browser/icon_tracks_move_grey.svg';

import {} from '../browserSelectors';

type BrowserTrackConfigProps = {
  selectedCog: number | null;
  ypos: number;
};

const BrowserTrackConfig: FunctionComponent<BrowserTrackConfigProps> = (
  props: BrowserTrackConfigProps
) => {
  let inline = {
    top: props.ypos - 3 + 'px',
    right: '40px',
    position: 'absolute'
  };
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
            <button className={styles.trackConfigSlider}>
              <img src={tracksSliderOffIcon} />
            </button>
          </dd>
          <dd className="featureLabels">
            <label htmlFor="">Feature labels</label>
            <button className={styles.trackConfigSlider}>
              <img src={tracksSliderOffIcon} />
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

const mapDispatchToProps: DispatchProps = {};

const mapStateToProps = (state: RootState): StateProps => ({});

export default connect()(BrowserTrackConfig);
