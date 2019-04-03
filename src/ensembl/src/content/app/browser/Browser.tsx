import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useEffect,
  Fragment
} from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, Replace } from 'connected-react-router';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import Drawer from './drawer/Drawer';

import { RootState } from 'src/store';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation
} from './browserState';
import {
  changeBrowserLocation,
  updateChrLocation,
  updateBrowserNavStates
} from './browserActions';
import {
  getBrowserOpenState,
  getBrowserNavOpened,
  getChrLocation,
  getGenomeSelectorActive,
  getBrowserActivated
} from './browserSelectors';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';
import { getDrawerOpened } from './drawer/drawerSelectors';
import {
  fetchExampleEnsObjectsData,
  fetchEnsObjectData
} from 'src/ens-object/ensObjectActions';
import { toggleDrawer } from './drawer/drawerActions';

import styles from './Browser.scss';

import 'static/browser/browser.js';

type StateProps = {
  browserActivated: boolean;
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
  fetchExampleEnsObjectsData: () => void;
  fetchEnsObjectData: (stableId: string) => void;
  replace: Replace;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
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

  const dispatchBrowserLocation = (chrLocation: ChrLocation) => {
    if (browserRef.current) {
      props.changeBrowserLocation(chrLocation, browserRef.current);
    }
  };

  useEffect(() => {
    const { stableId } = props.match.params;
    const location = props.location.search;
    const chrLocation = getChrLocationFromStr(location);

    dispatchBrowserLocation(chrLocation);

    props.fetchEnsObjectData(stableId);
  }, [props.match.params.stableId]);

  useEffect(() => {
    const [, chrStart, chrEnd] = props.chrLocation;

    if (props.browserActivated && chrStart > 0 && chrEnd > 0) {
      dispatchBrowserLocation(props.chrLocation);
    }
  }, [props.browserActivated]);

  useEffect(() => {
    const { params } = props.match;
    const newChrLocationStr = getChrLocationStr(props.chrLocation);
    const newUrl = `/app/browser/${params.species}/${
      params.stableId
    }?region=${newChrLocationStr}`;

    props.replace(newUrl);
  }, [props.chrLocation, props.location.search]);

  const closeTrack = useCallback(() => {
    if (props.drawerOpened === false) {
      return;
    }

    props.toggleDrawer(false);
  }, [props.drawerOpened]);

  return (
    <section className={styles.browser}>
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
            {props.browserNavOpened &&
            !props.drawerOpened &&
            browserRef.current ? (
              <BrowserNavBar browserElement={browserRef.current} />
            ) : null}
            <BrowserImage browserRef={browserRef} />
          </div>
          <TrackPanel browserRef={browserRef} />
          {props.drawerOpened && <Drawer />}
        </div>
      </Fragment>
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  chrLocation: getChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  genomeSelectorActive: getGenomeSelectorActive(state)
});

const mapDispatchToProps: DispatchProps = {
  changeBrowserLocation,
  fetchEnsObjectData,
  fetchExampleEnsObjectsData,
  replace,
  toggleDrawer,
  updateBrowserNavStates,
  updateChrLocation
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
