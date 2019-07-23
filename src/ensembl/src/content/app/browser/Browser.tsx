import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, Replace } from 'connected-react-router';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import upperFirst from 'lodash/upperFirst';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import AppBar from 'src/shared/app-bar/AppBar';

import { RootState } from 'src/store';
import { ChrLocation } from './browserState';
import {
  changeBrowserLocation,
  setDataFromUrlAndSave,
  ParsedUrlPayload
} from './browserActions';
import {
  getBrowserNavOpened,
  getChrLocation,
  getGenomeSelectorActive,
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserQueryParams,
  getBrowserActiveEnsObjectId,
  getBrowserActiveEnsObjectIds,
  getAllChrLocations
} from './browserSelectors';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getIsTrackPanelOpened } from './track-panel/trackPanelSelectors';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';
import { getIsDrawerOpened } from './drawer/drawerSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import { fetchGenomeData } from 'src/genome/genomeActions';
import { changeDrawerView, toggleDrawer } from './drawer/drawerActions';

import browserStorageService from './browser-storage-service';
import { TrackStates } from './track-panel/trackPanelConfig';
import { AppName } from 'src/global/globalConfig';

import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from './Browser.scss';

import 'static/browser/browser.js';

type StateProps = {
  activeGenomeId: string | null;
  activeEnsObjectId: string | null;
  allActiveEnsObjectIds: { [genomeId: string]: string };
  allChrLocations: { [genomeId: string]: ChrLocation };
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserQueryParams: { [key: string]: string };
  chrLocation: ChrLocation | null;
  genomeSelectorActive: boolean;
  isDrawerOpened: boolean;
  isTrackPanelOpened: boolean;
  launchbarExpanded: boolean;
  exampleEnsObjects: EnsObject[];
  committedSpecies: CommittedItem[];
};

type DispatchProps = {
  changeBrowserLocation: (
    genomeId: string,
    chrLocation: ChrLocation,
    browserEl: HTMLDivElement
  ) => void;
  changeDrawerView: (drawerView: string) => void;
  fetchGenomeData: (genomeId: string) => void;
  replace: Replace;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  setDataFromUrlAndSave: (payload: ParsedUrlPayload) => void;
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
  const lastGenomeIdRef = useRef(props.activeGenomeId);

  const { isDrawerOpened } = props;

  const setDataFromUrl = () => {
    const { genomeId = null } = props.match.params;
    const { focus = null, location = null } = props.browserQueryParams;
    const chrLocation = location ? getChrLocationFromStr(location) : null;

    const lastGenomeId = lastGenomeIdRef.current;

    /*
      before committing url changes to redux:
      - make sure we don't already have these same values in redux store;
      - if we already have these values, it's possible that this is because
        the user is switching back to a previously viewed species;
        so check whether the genome id has changed from the previous render
        (that's the reason for lastGenomeIdRef here)

      TODO: after both genome browser and browser chrome are updated so that
      we do not update url location while moving or zooming the image; we can
      remove the genomeId === lastGenomeId check in the if-statement below
      and move dispatchBrowserLocation(genomeId, chrLocation) above the if-statement
    */
    if (
      !genomeId ||
      (genomeId === lastGenomeId &&
        genomeId === props.activeGenomeId &&
        focus === props.activeEnsObjectId &&
        isEqual(chrLocation, props.chrLocation))
    ) {
      return;
    }

    const payload = {
      activeGenomeId: genomeId,
      activeEnsObjectId: focus || null,
      chrLocation
    };

    props.setDataFromUrlAndSave(payload);

    chrLocation && dispatchBrowserLocation(genomeId, chrLocation);
    lastGenomeIdRef.current = genomeId;
  };

  const dispatchBrowserLocation = (
    genomeId: string,
    chrLocation: ChrLocation
  ) => {
    if (browserRef.current) {
      props.changeBrowserLocation(genomeId, chrLocation, browserRef.current);
    }
  };

  const changeSelectedSpecies = (genomeId: string) => {
    const { allChrLocations, allActiveEnsObjectIds } = props;
    const chrLocation = allChrLocations[genomeId];
    const activeEnsObjectId = allActiveEnsObjectIds[genomeId];

    const params = {
      genomeId,
      focus: activeEnsObjectId,
      location: chrLocation ? getChrLocationStr(chrLocation) : null
    };

    props.replace(urlFor.browser(params));
  };

  // handle url changes
  useEffect(() => {
    // handle navigation to /app/browser
    if (!props.match.params.genomeId) {
      // select either the species that the user viewed during the previous visit,
      // of the first selected species
      const { activeGenomeId, committedSpecies } = props;
      if (
        activeGenomeId &&
        find(
          committedSpecies,
          ({ genome_id }: CommittedItem) => genome_id === activeGenomeId
        )
      ) {
        changeSelectedSpecies(activeGenomeId);
      } else {
        if (committedSpecies[0]) {
          changeSelectedSpecies(committedSpecies[0].genome_id);
        }
      }
    } else {
      // handle navigation to /app/browser/:genomeId?focus=:focus&location=:location
      setDataFromUrl();
    }
  }, [props.match.params.genomeId, props.location.search]);

  useEffect(() => {
    const { activeGenomeId, fetchGenomeData } = props;
    activeGenomeId && fetchGenomeData(activeGenomeId);
  }, [props.activeGenomeId]);

  useEffect(() => {
    setTrackStatesFromStorage(browserStorageService.getTrackStates());
  }, [props.activeGenomeId, props.activeEnsObjectId]);

  useEffect(() => {
    const {
      match: {
        params: { genomeId }
      },
      browserQueryParams: { location }
    } = props;
    const chrLocation = location ? getChrLocationFromStr(location) : null;

    if (props.browserActivated && genomeId && chrLocation) {
      dispatchBrowserLocation(genomeId, chrLocation);
    }
  }, [props.browserActivated]);

  const updateLocationInUrl = () => {
    const {
      match: {
        params: { genomeId }
      },
      browserQueryParams: { focus, location },
      chrLocation
    } = props;

    const chrLocationFromUrl =
      (location && getChrLocationFromStr(location)) || null;

    if (isEqual(chrLocation, chrLocationFromUrl)) {
      return;
    }

    const newUrl = urlFor.browser({
      genomeId,
      focus,
      location: chrLocation ? getChrLocationStr(chrLocation) : null
    });
    props.replace(newUrl);
  };

  useEffect(() => {
    // update url if the only difference between the url and the current state
    // is location (which means a new location was reported by genome browser)
    if (
      props.match.params.genomeId === props.activeGenomeId &&
      props.browserQueryParams.focus === props.activeEnsObjectId
    ) {
      updateLocationInUrl();
    }
  }, [props.chrLocation]);

  const closeDrawer = () => {
    props.changeDrawerView('');
    props.toggleDrawer(false);
  };

  const closeTrack = () => {
    if (!isDrawerOpened) {
      return;
    }

    closeDrawer();
  };

  const [trackAnimation, setTrackAnimation] = useSpring(() => ({
    config: { tension: 280, friction: 45 },
    height: '100%',
    width: 'calc(-36px + 100vw )'
  }));

  const getBrowserWidth = (): string => {
    if (isDrawerOpened) {
      return '41px';
    }
    return props.isTrackPanelOpened
      ? 'calc(-356px + 100vw)'
      : 'calc(-36px + 100vw)';
  };

  useEffect(() => {
    setTrackAnimation({
      width: getBrowserWidth()
    });
  }, [isDrawerOpened, props.isTrackPanelOpened]);

  const getHeightClass = (launchbarExpanded: boolean): string => {
    return launchbarExpanded ? styles.shorter : styles.taller;
  };

  const BrowserBarNode = (
    <BrowserBar
      closeDrawer={closeDrawer}
      dispatchBrowserLocation={dispatchBrowserLocation}
    />
  );

  return props.activeGenomeId ? (
    <>
      <AppBar
        currentAppName={AppName.GENOME_BROWSER}
        activeGenomeId={props.activeGenomeId}
        onTabSelect={changeSelectedSpecies}
      />

      {!props.browserQueryParams.focus && (
        <section className={styles.browser}>
          {BrowserBarNode}
          <ExampleObjectLinks {...props} />
        </section>
      )}
      {props.browserQueryParams.focus && (
        <section className={styles.browser}>
          {BrowserBarNode}
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
                !isDrawerOpened &&
                browserRef.current ? (
                  <BrowserNavBar browserElement={browserRef.current} />
                ) : null}
                <BrowserImage
                  browserRef={browserRef}
                  trackStates={trackStatesFromStorage}
                />
              </div>
            </animated.div>
            <TrackPanel browserRef={browserRef} closeDrawer={closeDrawer} />
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
      <div key={exampleObject.ensembl_object_id} className={styles.exampleLink}>
        <Link to={path}>
          <span className={styles.objectType}>
            {upperFirst(exampleObject.object_type)}
          </span>
          <span className={styles.objectLabel}>{exampleObject.label}</span>
        </Link>
      </div>
    );
  });

  return <div className={styles.exampleLinks}>{links}</div>;
};

const mapStateToProps = (state: RootState): StateProps => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  activeEnsObjectId: getBrowserActiveEnsObjectId(state),
  allActiveEnsObjectIds: getBrowserActiveEnsObjectIds(state),
  allChrLocations: getAllChrLocations(state),
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserQueryParams: getBrowserQueryParams(state),
  chrLocation: getChrLocation(state),
  genomeSelectorActive: getGenomeSelectorActive(state),
  isDrawerOpened: getIsDrawerOpened(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  committedSpecies: getEnabledCommittedSpecies(state)
});

const mapDispatchToProps: DispatchProps = {
  changeBrowserLocation,
  changeDrawerView,
  fetchGenomeData,
  replace,
  toggleDrawer,
  setDataFromUrlAndSave
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
