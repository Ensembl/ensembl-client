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
  changeBrowserLocation,
  toggleDrawer,
  updateChrLocation,
  updateBrowserNavStates,
  updateBrowserActivated
} from './browserActions';
import {
  getBrowserOpenState,
  getDrawerOpened,
  getBrowserNavOpened,
  getChrLocation,
  getTrackConfigNames,
  getGenomeSelectorActive,
  getBrowserActivated
} from './browserSelectors';

import styles from './Browser.scss';

import 'static/browser/browser.js';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';

type StateProps = {
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  chrLocation: ChrLocation;
  drawerOpened: boolean;
  genomeSelectorActive: boolean;
};

type DispatchProps = {
  changeBrowserLocation: (
    chrLocation: ChrLocation,
    browserEl: HTMLDivElement
  ) => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
};

type OwnProps = {};

type MatchParams = {
  location: string;
  objSymbol: string;
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

  const dispatchBrowserLocation = (chrLocation: ChrLocation) => {
    if (browserRef.current) {
      props.changeBrowserLocation(chrLocation, browserRef.current);
    }
  };

  useEffect(() => {
    const { location } = props.match.params;
    const chrLocation = getChrLocationFromStr(location);

    dispatchBrowserLocation(chrLocation);
  }, []);

  useEffect(() => {
    if (props.chrLocation[2]) {
      let chrLocation = [
        props.chrLocation[0],
        props.chrLocation[1] + 1,
        props.chrLocation[2]
      ];
      props.updateChrLocation(chrLocation);
      props.changeBrowserLocation(chrLocation, browserRef.current);
    }
  }, [
    props.browserActivated,
    props.updateChrLocation,
    props.changeBrowserLocation
  ]);

  useEffect(() => {
    const { path, params } = props.match;
    const newChrLocationStr = getChrLocationStr(props.chrLocation);
    const newUrl = path
      .replace(':species', params.species)
      .replace(':objSymbol', params.objSymbol)
      .replace(':location', newChrLocationStr);

    props.history.replace(newUrl);
  }, [props.chrLocation]);

  const closeTrack = useCallback(() => {
    if (props.drawerOpened === false) {
      return;
    }

    props.toggleDrawer(false);
  }, [props.drawerOpened]);

  return (
    <section className={styles.browser}>
      <BrowserBar dispatchBrowserLocation={dispatchBrowserLocation} />
      {props.genomeSelectorActive ? (
        <div className={styles.browserOverlay} />
      ) : null}
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
  chrLocation: getChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  genomeSelectorActive: getGenomeSelectorActive(state),
  browserActivated: getBrowserActivated(state)
});

const mapDispatchToProps: DispatchProps = {
  changeBrowserLocation,
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
