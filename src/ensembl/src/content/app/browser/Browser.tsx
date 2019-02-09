import React, { FunctionComponent, useCallback } from 'react';
import { connect } from 'react-redux';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import Drawer from './drawer/Drawer';

import { RootState } from 'src/rootReducer';
import { BrowserOpenState } from './browserState';
import { toggleDrawer, toggleBrowserNav } from './browserActions';
import {
  getBrowserOpenState,
  getDrawerOpened,
  getBrowserNavOpened
} from './browserSelectors';

import 'static/browser/browser.js';

import styles from './Browser.scss';

type BrowserProps = {
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  drawerOpened: boolean;
  toggleBrowserNav: () => void;
  toggleDrawer: (drawerOpened: boolean) => void;
};

export const Browser: FunctionComponent<BrowserProps> = (
  props: BrowserProps
) => {
  const closeTrack = useCallback(() => {
    if (props.drawerOpened === false) {
      return;
    }

    props.toggleDrawer(false);
  }, [props.drawerOpened, props.toggleDrawer]);

  return (
    <section className={styles.browser}>
      <BrowserBar
        browserNavOpened={props.browserNavOpened}
        expanded={true}
        toggleBrowserNav={props.toggleBrowserNav}
      />
      <div className={styles.browserInnerWrapper}>
        <div
          className={`${styles.browserImageWrapper} ${
            styles[props.browserOpenState]
          }`}
          onClick={closeTrack}
        >
          {props.browserNavOpened && <BrowserNavBar />}
          <BrowserImage />
        </div>
        <TrackPanel />
        {props.drawerOpened && <Drawer />}
      </div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  drawerOpened: getDrawerOpened(state)
});

const mapDispatchToProps = {
  toggleDrawer,
  toggleBrowserNav
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Browser);
