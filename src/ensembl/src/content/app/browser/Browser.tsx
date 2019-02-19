import React, { FunctionComponent, useCallback, useRef } from 'react';
import { connect } from 'react-redux';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import Drawer from './drawer/Drawer';

import { RootState } from 'src/rootReducer';
import { BrowserOpenState } from './browserState';
import { toggleDrawer } from './browserActions';
import {
  getBrowserOpenState,
  getDrawerOpened,
  getBrowserNavOpened
} from './browserSelectors';

import styles from './Browser.scss';

import 'static/browser/browser.js';

type StateProps = {
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  drawerOpened: boolean;
};

type DispatchProps = {
  toggleDrawer: (drawerOpened: boolean) => void;
};

type OwnProps = {};

type BrowserProps = StateProps & DispatchProps & OwnProps;

export const Browser: FunctionComponent<BrowserProps> = (
  props: BrowserProps
) => {
  const browserRef: React.RefObject<HTMLDivElement> = useRef(null);

  const closeTrack = useCallback(() => {
    if (props.drawerOpened === false) {
      return;
    }

    props.toggleDrawer(false);
  }, [props.drawerOpened, props.toggleDrawer]);

  return (
    <section className={styles.browser}>
      <BrowserBar browserRef={browserRef} />
      <div className={styles.browserInnerWrapper}>
        <div
          className={`${styles.browserImageWrapper} ${
            styles[props.browserOpenState]
          }`}
          onClick={closeTrack}
        >
          {props.browserNavOpened && <BrowserNavBar browserRef={browserRef} />}
          <BrowserImage browserRef={browserRef} />
        </div>
        <TrackPanel browserRef={browserRef} />
        {props.drawerOpened && <Drawer />}
      </div>
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  drawerOpened: getDrawerOpened(state)
});

const mapDispatchToProps: DispatchProps = {
  toggleDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Browser);
