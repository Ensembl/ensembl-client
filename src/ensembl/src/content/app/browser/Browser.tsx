import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, Replace } from 'connected-react-router';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import find from 'lodash/find';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import AppBar from 'src/shared/app-bar/AppBar';
import upperFirst from 'lodash/upperFirst';

import { RootState } from 'src/store';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation
} from './browserState';
import {
  changeBrowserLocation,
  updateBrowserNavStates,
  updateBrowserActiveGenomeIdAndSave,
  updateBrowserActiveEnsObjectIdsAndSave
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
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { fetchEnsObject } from 'src/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { GenomeInfoData } from 'src/genome/genomeTypes';
import {
  fetchGenomeData,
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
  activeGenomeId: string | null;
  activeEnsObjectId: string | null;
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  browserQueryParams: { [key: string]: string };
  chrLocation: ChrLocation | null;
  drawerOpened: boolean;
  genomeInfo: GenomeInfoData;
  genomeSelectorActive: boolean;
  trackPanelOpened: boolean;
  launchbarExpanded: boolean;
  exampleEnsObjects: EnsObject[];
  committedSpecies: CommittedItem[];
};

type DispatchProps = {
  changeBrowserLocation: (
    chrLocation: ChrLocation,
    browserEl: HTMLDivElement
  ) => void;
  fetchEnsObject: (ensObjectId: string, genomeId: string) => void;
  fetchGenomeData: (genomeId: string) => void;
  fetchGenomeInfo: (genomeId: string) => void;
  fetchGenomeTrackCategories: (genomeId: string) => void;
  replace: Replace;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateBrowserActiveGenomeIdAndSave: (genomeId: string) => void;
  updateBrowserActiveEnsObjectIdsAndSave: (objectId: string) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
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

  const changeSelectedSpecies = (genomeId: string) => {
    console.log('in changeSelectedSpecies');
    props.fetchGenomeData(genomeId);
    props.updateBrowserActiveGenomeIdAndSave(genomeId);
  };

  const onGenomeChange = (genomeId: string) => {
    console.log('props in onGenomeChange', props);
    const { chrLocation } = props;

    let newUrl: string;
    if (chrLocation) {
      const params = {
        genomeId,
        focus: props.activeEnsObjectId,
        location: getChrLocationStr(chrLocation)
      };
      newUrl = urlFor.browser(params);
    } else {
      newUrl = urlFor.browser({ genomeId });
    }
    props.replace(newUrl);
  };

  useEffect(() => {
    if (!props.match.params.genomeId) {
      // when there is no genome id in the url, use active genome id saved in the state
      // or genome id of the first selected species
      const { activeGenomeId, committedSpecies } = props;
      if (committedSpecies[0]) {
        changeSelectedSpecies(committedSpecies[0].genome_id);
      }

      // if (
      //   activeGenomeId &&
      //   find(
      //     committedSpecies,
      //     ({ genome_id }: CommittedItem) => genome_id === activeGenomeId
      //   )
      // ) {
      //   changeSelectedSpecies(activeGenomeId);
      // } else {
      //   if (committedSpecies[0]) {
      //     changeSelectedSpecies(committedSpecies[0].genome_id);
      //   }
      // }
    }
    setTrackStatesFromStorage(browserStorageService.getTrackStates());
  }, [props.match.params.genomeId]);

  useEffect(() => {
    if (props.activeGenomeId) {
      onGenomeChange(props.activeGenomeId);
    }
  }, [props.activeGenomeId]);

  // useEffect(() => {
  //   const { genomeId } = props.match.params;

  //   if (!genomeId) {
  //     return;
  //   }

  //   props.updateBrowserActiveGenomeIdAndSave(genomeId);

  //   props.fetchGenomeInfo(genomeId);
  //   props.fetchGenomeTrackCategories(genomeId);
  // }, [props.match.params.genomeId]);

  // useEffect(() => {
  //   props.fetchExampleEnsObjects(props.activeGenomeId);
  // }, [props.genomeInfo]);

  useEffect(() => {
    const { focus, location } = props.browserQueryParams;
    const { genomeId } = props.match.params;
    const parsedLocation = location && getChrLocationFromStr(location);

    if (!parsedLocation || !focus) {
      return;
    }

    props.updateBrowserActiveEnsObjectIdsAndSave(focus);
    dispatchBrowserLocation(parsedLocation);
    props.fetchEnsObject(focus, genomeId);
  }, [props.browserQueryParams.focus]);

  useEffect(() => {
    const { chrLocation } = props;

    if (props.browserActivated && chrLocation) {
      dispatchBrowserLocation(chrLocation);
    }
  }, [props.browserActivated]);

  const updateLocationInUrl = () => {
    const {
      match: {
        params: { genomeId }
      },
      browserQueryParams,
      activeEnsObjectId,
      chrLocation
    } = props;
    if (!genomeId) {
      // there is no sense in updating location parameters in url
      // if we don’t yet know genome id
      return;
    }

    let { focus } = browserQueryParams;
    if (!focus && activeEnsObjectId) {
      focus = activeEnsObjectId;
    }

    const location =
      (chrLocation && getChrLocationStr(chrLocation)) ||
      props.browserQueryParams.location;

    const newUrl = urlFor.browser({ genomeId, focus, location });
    props.replace(newUrl);
  };

  useEffect(() => {
    updateLocationInUrl();
  }, [props.chrLocation]);

  const closeTrack = () => {
    if (props.drawerOpened === false) {
      return;
    }
    props.toggleDrawer(false);
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

  return props.activeGenomeId ? (
    <>
      <AppBar
        currentAppName={AppName.GENOME_BROWSER}
        activeGenomeId={props.activeGenomeId}
        onTabSelect={changeSelectedSpecies}
      />

      {!props.browserQueryParams.focus && (
        <section className={styles.browser}>
          <BrowserBar dispatchBrowserLocation={dispatchBrowserLocation} />
          <ExampleObjectLinks {...props} />
        </section>
      )}
      {props.browserQueryParams.focus && (
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
            <TrackPanel browserRef={browserRef} />
          </div>
        </section>
      )}
    </>
  ) : null;
};

const ExampleObjectLinks = (props: BrowserProps) => {
  const { activeGenomeId } = props;
  if (!activeGenomeId) {
    return null;
  }
  const links = props.exampleEnsObjects.map((exampleObject: EnsObject) => {
    const location = `${exampleObject.location.chromosome}:${exampleObject.location.start}-${exampleObject.location.end}`;
    const path = urlFor.browser({
      genomeId: activeGenomeId,
      focus: exampleObject.ensembl_object_id,
      location
    });

    return (
      <div key={exampleObject.ensembl_object_id}>
        <Link to={path}>
          <span className={styles.objectType}>
            {upperFirst(exampleObject.object_type)}
          </span>
          <span className={styles.objectLabel}>{exampleObject.label}</span>
        </Link>
      </div>
    );
  });

  return <>{links}</>;
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
  genomeInfo: getGenomeInfo(state),
  genomeSelectorActive: getGenomeSelectorActive(state),
  trackPanelOpened: getTrackPanelOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  committedSpecies: getEnabledCommittedSpecies(state)
});

const mapDispatchToProps: DispatchProps = {
  changeBrowserLocation,
  fetchEnsObject,
  fetchGenomeData,
  fetchGenomeInfo,
  fetchGenomeTrackCategories,
  replace,
  toggleDrawer,
  updateBrowserActiveGenomeIdAndSave,
  updateBrowserNavStates,
  updateBrowserActiveEnsObjectIdsAndSave
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
