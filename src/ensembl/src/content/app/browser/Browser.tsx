import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useEffect,
  useState
} from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, Replace } from 'connected-react-router';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import Drawer from './drawer/Drawer';
import AppBar from 'src/shared/app-bar/AppBar';

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
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserQueryParams
} from './browserSelectors';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';
import { getDrawerOpened } from './drawer/drawerSelectors';
import {
  fetchExampleEnsObjectsData,
  fetchEnsObjectData
} from 'src/ens-object/ensObjectActions';
import { toggleDrawer } from './drawer/drawerActions';

import browserStorageService from './browser-storage-service';
import { TrackStates } from './track-panel/trackPanelConfig';
import { AppName } from 'src/global/globalConfig';

import styles from './Browser.scss';

import 'static/browser/browser.js';

type StateProps = {
  activeGenomeId: string;
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  browserQueryParams: { [key: string]: string };
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
  genomeId: string;
};

type BrowserProps = RouteComponentProps<MatchParams> &
  StateProps &
  DispatchProps &
  OwnProps;

export const Browser: FunctionComponent<BrowserProps> = (
  props: BrowserProps
) => {
  const browserRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [trackStatesFromStorage, setTrackStatesFromStorage] = useState<
    TrackStates
  >({});

  const dispatchBrowserLocation = (chrLocation: ChrLocation) => {
    if (browserRef.current) {
      props.changeBrowserLocation(chrLocation, browserRef.current);
    }
  };

  useEffect(() => {
    setTrackStatesFromStorage(browserStorageService.getTrackStates());
  }, []);

  useEffect(() => {
    const { focus, location } = props.browserQueryParams;
    const chrLocation = getChrLocationFromStr(location);

    dispatchBrowserLocation(chrLocation);
    props.fetchEnsObjectData(focus);
  }, [props.browserQueryParams.focus]);

  useEffect(() => {
    const [, chrStart, chrEnd] = props.chrLocation;

    if (props.browserActivated && chrStart > 0 && chrEnd > 0) {
      dispatchBrowserLocation(props.chrLocation);
    }
  }, [props.browserActivated]);

  useEffect(() => {
    const { genomeId } = props.match.params;
    const { focus } = props.browserQueryParams;
    const locationStr = getChrLocationStr(props.chrLocation);
    const newUrl = `/app/browser/${genomeId}?focus=${focus}&location=${locationStr}`;

    props.replace(newUrl);
  }, [props.chrLocation, props.browserQueryParams.region]);

  const closeTrack = useCallback(() => {
    if (props.drawerOpened === false) {
      return;
    }

    props.toggleDrawer(false);
  }, [props.drawerOpened]);

  const changeSelectedSpecies = (genomeId: string) => {};

  return (
    <>
      <AppBar
        currentAppName={AppName.GENOME_BROWSER}
        activeGenomeId={props.activeGenomeId}
        onTabSelect={changeSelectedSpecies}
      />
      <section className={styles.browser}>
        <>
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
              <BrowserImage
                browserRef={browserRef}
                trackStates={trackStatesFromStorage}
              />
            </div>
            <TrackPanel
              browserRef={browserRef}
              trackStates={trackStatesFromStorage}
            />
            {props.drawerOpened && <Drawer />}
          </div>
        </>
      </section>
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  browserQueryParams: getBrowserQueryParams(state),
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
