import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, Replace } from 'connected-react-router';
import { useSpring, animated } from 'react-spring';

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
  updateChrLocationAndSave,
  updateBrowserNavStates,
  updateBrowserActiveGenomeIdAndSave
} from './browserActions';
import {
  getBrowserOpenState,
  getBrowserNavOpened,
  getChrLocation,
  getGenomeSelectorActive,
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserQueryParams,
  getBrowserActiveEnsObjectId
} from './browserSelectors';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getTrackPanelOpened } from './track-panel/trackPanelSelectors';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';
import { getDrawerOpened } from './drawer/drawerSelectors';
import {
  fetchEnsObject,
  fetchEnsObjectTracks
} from 'src/ens-object/ensObjectActions';
import {
  fetchGenomeInfo,
  fetchGenomeTrackCategories
} from 'src/genome/genomeActions';
import { toggleDrawer } from './drawer/drawerActions';

import browserStorageService from './browser-storage-service';
import { TrackStates } from './track-panel/trackPanelConfig';
import { AppName } from 'src/global/globalConfig';
import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from './Browser.scss';

import 'static/browser/browser.js';

type StateProps = {
  activeGenomeId: string;
  activeEnsObjectId: { [genomeId: string]: string };
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  browserQueryParams: { [key: string]: string };
  chrLocation: { [genomeId: string]: ChrLocation };
  drawerOpened: boolean;
  genomeSelectorActive: boolean;
  trackPanelOpened: boolean;
  launchbarExpanded: boolean;
};

type DispatchProps = {
  changeBrowserLocation: (
    chrLocation: ChrLocation,
    browserEl: HTMLDivElement
  ) => void;
  fetchEnsObject: (ensObjectId: string, genomeId: string) => void;
  fetchEnsObjectTracks: (ensObjectId: string, genomeId: string) => void;
  fetchGenomeInfo: (genomeId: string) => void;
  fetchGenomeTrackCategories: (genomeId: string) => void;
  replace: Replace;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateBrowserActiveGenomeIdAndSave: (genomeId: string) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocationAndSave: (chrLocation: ChrLocation) => void;
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
    if (props.match.params.genomeId === undefined) {
      const locationStr = getChrLocationStr(
        props.chrLocation[props.activeGenomeId]
      );

      const browserUrl = urlFor.browser(
        props.activeGenomeId,
        props.activeEnsObjectId[props.activeGenomeId],
        locationStr
      );
      props.replace(browserUrl);
    } else {
      setTrackStatesFromStorage(browserStorageService.getTrackStates());
    }
  }, []);

  useEffect(() => {
    const { genomeId } = props.match.params;

    props.updateBrowserActiveGenomeIdAndSave(genomeId);
    props.fetchGenomeTrackCategories(genomeId);
    props.fetchGenomeInfo(genomeId);
  }, [props.match.params.genomeId]);

  useEffect(() => {
    const { focus, location } = props.browserQueryParams;
    const { genomeId } = props.match.params;
    const chrLocation = getChrLocationFromStr(location);

    dispatchBrowserLocation(chrLocation);
    props.fetchEnsObject(focus, genomeId);
    props.fetchEnsObjectTracks(focus, genomeId);
  }, [props.browserQueryParams.focus]);

  useEffect(() => {
    const chrLocationForGenome = props.chrLocation[props.activeGenomeId] || [
      '',
      0,
      0
    ];
    const [, chrStart, chrEnd] = chrLocationForGenome;

    if (props.browserActivated && chrStart > 0 && chrEnd > 0) {
      dispatchBrowserLocation(chrLocationForGenome);
    }
  }, [props.browserActivated]);

  const updateBrowserUrl = (genomeId: string = props.match.params.genomeId) => {
    const { focus } = props.browserQueryParams;
    const chrLocationForGenome = props.chrLocation[props.activeGenomeId];
    const locationStr = getChrLocationStr(chrLocationForGenome);
    const newUrl = urlFor.browser(genomeId, focus, locationStr);

    props.replace(newUrl);
  };

  useEffect(() => {
    updateBrowserUrl();
  }, [props.chrLocation, props.browserQueryParams.location]);

  const closeTrack = () => {
    if (props.drawerOpened === false) {
      return;
    }
    props.toggleDrawer(false);
  };

  const changeSelectedSpecies = (genomeId: string) => {
    props.updateBrowserActiveGenomeIdAndSave(genomeId);
    updateBrowserUrl(genomeId);
  };

  const [trackAnimation, setTrackAnimation] = useSpring(() => ({
    config: { tension: 280, friction: 45 },
    height: '100%',
    width: 'calc(-36px + 100vw )'
  }));

  const getBrowserWidth = (): string => {
    if (props.drawerOpened) {
      return 'calc(41px + 0vw)';
    }
    return props.trackPanelOpened
      ? 'calc(-356px + 100vw)'
      : 'calc(-36px + 100vw)';
  };

  useEffect(() => {
    setTrackAnimation({
      width: getBrowserWidth()
    });
  }, [props.drawerOpened, props.trackPanelOpened]);

  const getHeightClass = (launchbarExpanded: boolean): string => {
    return launchbarExpanded ? styles.shorter : styles.taller;
  };

  return (
    <>
      <AppBar
        currentAppName={AppName.GENOME_BROWSER}
        activeGenomeId={props.activeGenomeId}
        onTabSelect={changeSelectedSpecies}
      />
      <section className={styles.browser}>
        <BrowserBar dispatchBrowserLocation={dispatchBrowserLocation} />
        {props.genomeSelectorActive && (
          <div className={styles.browserOverlay} />
        )}
        <div
          className={`${styles.browserInnerWrapper} ${getHeightClass(
            props.launchbarExpanded
          )}`}
        >
          <animated.div style={trackAnimation}>
            <div className={styles.browserImageWrapper} onClick={closeTrack}>
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
          </animated.div>
          <TrackPanel
            browserRef={browserRef}
            trackStates={trackStatesFromStorage}
          />
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  activeEnsObjectId: getBrowserActiveEnsObjectId(state),
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  browserQueryParams: getBrowserQueryParams(state),
  chrLocation: getChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  genomeSelectorActive: getGenomeSelectorActive(state),
  trackPanelOpened: getTrackPanelOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state)
});

const mapDispatchToProps: DispatchProps = {
  changeBrowserLocation,
  fetchEnsObject,
  fetchEnsObjectTracks,
  fetchGenomeInfo,
  fetchGenomeTrackCategories,
  replace,
  toggleDrawer,
  updateBrowserActiveGenomeIdAndSave,
  updateBrowserNavStates,
  updateChrLocationAndSave
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
