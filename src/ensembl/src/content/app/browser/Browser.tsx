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
  updateBrowserActivated,
  updateDefaultChrLocation
} from './browserActions';
import {
  getBrowserOpenState,
  getDrawerOpened,
  getBrowserNavOpened,
  getChrLocation,
  getGenomeSelectorActive
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
  toggleDrawer: (drawerOpened: boolean) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
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

  const changeBrowserLocation = () => {
    const [chrCode, startBp, endBp] = props.chrLocation;

    const stickEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail: {
        stick: chrCode
      }
    });

    const gotoEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail: {
        goto: `${startBp}-${endBp}`
      }
    });

    if (browserRef.current) {
      browserRef.current.dispatchEvent(stickEvent);
      browserRef.current.dispatchEvent(gotoEvent);
    }
  };

  useEffect(() => {
    const location = props.history.location.search;
    const chrLocation = getChrLocationFromStr(location);

    props.updateDefaultChrLocation(chrLocation);
    changeBrowserLocation();
  }, []);

  useEffect(() => {
    const { path, params } = props.match;
    const newChrLocationStr = getChrLocationStr(props.chrLocation);
    const newUrl =
      path
        .replace(':species', params.species)
        .replace(':objSymbol', params.objSymbol) +
      '?region=' +
      newChrLocationStr;

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
      <BrowserBar changeBrowserLocation={changeBrowserLocation} />
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
  genomeSelectorActive: getGenomeSelectorActive(state)
});

const mapDispatchToProps: DispatchProps = {
  toggleDrawer,
  updateBrowserActivated,
  updateBrowserNavStates,
  updateChrLocation,
  updateDefaultChrLocation
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
