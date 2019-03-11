import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useEffect,
  useState,
  Fragment
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
  fetchExampleObjectsData,
  fetchObjectData,
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
  getGenomeSelectorActive,
  getBrowserActivated,
  getExampleObjects
} from './browserSelectors';

import styles from './Browser.scss';

import 'static/browser/browser.js';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';

type StateProps = {
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  chrLocation: ChrLocation;
  drawerOpened: boolean;
  exampleObjects: {};
  genomeSelectorActive: boolean;
};

type DispatchProps = {
  changeBrowserLocation: (
    chrLocation: ChrLocation,
    browserEl: HTMLDivElement
  ) => void;
  fetchExampleObjectsData: () => void;
  fetchObjectData: (stableId: string) => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
  updateDefaultChrLocation: (chrLocation: ChrLocation) => void;
};

type OwnProps = {};

type MatchParams = {
  location: string;
  stableId: string;
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
  const [showBrowser, toggleShowBrowser] = useState(true);

  const dispatchBrowserLocation = (chrLocation: ChrLocation) => {
    if (browserRef.current) {
      props.changeBrowserLocation(chrLocation, browserRef.current);
    }
  };

  useEffect(() => {
    if (Object.values(props.exampleObjects).length > 0) {
      toggleShowBrowser(true);
    } else {
      props.fetchExampleObjectsData();
      toggleShowBrowser(false);
    }
  }, [props.exampleObjects]);

  useEffect(() => {
    const { location, stableId } = props.match.params;
    const chrLocation = getChrLocationFromStr(location);

    dispatchBrowserLocation(chrLocation);

    props.fetchObjectData(stableId);
  }, [props.match.params.stableId]);

  useEffect(() => {
    const [, chrStart, chrEnd] = props.chrLocation;

    if (props.browserActivated && chrStart > 0 && chrEnd > 0) {
      dispatchBrowserLocation(props.chrLocation);
    }
  }, [props.browserActivated]);

  useEffect(() => {
    const { path, params } = props.match;
    const newChrLocationStr = getChrLocationStr(props.chrLocation);
    const newUrl = path
      .replace(':species', params.species)
      .replace(':stableId', params.stableId)
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
      {showBrowser ? (
        <Fragment>
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
              {props.browserNavOpened && !props.drawerOpened ? (
                <BrowserNavBar browserRef={browserRef} />
              ) : null}
              <BrowserImage browserRef={browserRef} />
            </div>
            <TrackPanel browserRef={browserRef} />
            {props.drawerOpened && <Drawer />}
          </div>
        </Fragment>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  chrLocation: getChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  exampleObjects: getExampleObjects(state),
  genomeSelectorActive: getGenomeSelectorActive(state)
});

const mapDispatchToProps: DispatchProps = {
  changeBrowserLocation,
  fetchExampleObjectsData,
  fetchObjectData,
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
