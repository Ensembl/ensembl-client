import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useEffect
} from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import Drawer from './drawer/Drawer';

import { RootState } from 'src/rootReducer';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation
} from './browserState';
import {
  toggleDrawer,
  updateChrLocation,
  updateBrowserNavStates,
  updateBrowserActivated
} from './browserActions';
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
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
};

type OwnProps = {};

type MatchParams = {
  geneSymbol: string;
  species: string;
};

type BrowserProps = RouteComponentProps<MatchParams> &
  StateProps &
  DispatchProps &
  OwnProps;

export const Browser: FunctionComponent<BrowserProps> = (
  props: BrowserProps
) => {
  const browserRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const { species, geneSymbol } = props.match.params;

    if (!species || !geneSymbol) {
      props.history.replace('/app/browser/human/BRCA2');
    }
  }, []);

  const closeTrack = useCallback(() => {
    if (props.drawerOpened === false) {
      return;
    }

    props.toggleDrawer(false);
  }, [props.drawerOpened]);

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
          <BrowserImage
            browserRef={browserRef}
            browserNavOpened={props.browserNavOpened}
            updateBrowserActivated={props.updateBrowserActivated}
            updateBrowserNavStates={props.updateBrowserNavStates}
            updateChrLocation={props.updateChrLocation}
          />
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
  toggleDrawer,
  updateBrowserActivated,
  updateBrowserNavStates,
  updateChrLocation
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
