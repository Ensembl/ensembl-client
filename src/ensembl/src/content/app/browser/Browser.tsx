import React, { FunctionComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import Drawer from './drawer/Drawer';

import { RootState } from 'src/rootReducer';
import { BrowserOpenState } from './browserState';
import { closeDrawer, toggleBrowserNav } from './browserActions';
import {
  getBrowserOpenState,
  getDrawerOpened,
  getBrowserNavOpened
} from './browserSelectors';

import 'static/browser/browser';

import styles from './Browser.scss';

type BrowserProps = {
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  closeDrawer: () => void;
  drawerOpened: boolean;
  toggleBrowserNav: () => void;
};

export const Browser: FunctionComponent<BrowserProps> = (
  props: BrowserProps
) => {
  const closeTrack = () => {
    if (props.drawerOpened === false) {
      return;
    }

    props.closeDrawer();
  };

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
  closeDrawer,
  toggleBrowserNav
};

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
