import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import BrowserAppBar from './browser-app-bar/BrowserAppBar';

import { RootState } from 'src/store';
import { ChrLocation, ChrLocations } from './browserState';
import {
  changeBrowserLocation,
  changeFocusObject,
  setDataFromUrlAndSave,
  ParsedUrlPayload,
  restoreBrowserTrackStates
} from './browserActions';
import {
  getBrowserNavOpened,
  getChrLocation,
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
import { getExampleEnsObjects } from 'src/shared/state/ens-object/ensObjectSelectors';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import analyticsTracking from 'src/services/analytics-service';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import {
  changeDrawerView,
  closeDrawer,
  toggleDrawer
} from './drawer/drawerActions';

import browserStorageService from './browser-storage-service';
import { BrowserTrackStates } from './track-panel/trackPanelConfig';
import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from './Browser.scss';

import 'ensembl-genome-browser';

export type BrowserProps = {
  activeGenomeId: string | null;
  activeEnsObjectId: string | null;
  allActiveEnsObjectIds: { [genomeId: string]: string };
  allChrLocations: ChrLocations;
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserQueryParams: { [key: string]: string };
  chrLocation: ChrLocation | null;
  isDrawerOpened: boolean;
  isTrackPanelOpened: boolean;
  launchbarExpanded: boolean;
  exampleEnsObjects: EnsObject[];
  committedSpecies: CommittedItem[];
  changeBrowserLocation: (locationData: {
    genomeId: string;
    ensObjectId: string | null;
    chrLocation: ChrLocation;
  }) => void;
  changeFocusObject: (objectId: string) => void;
  changeDrawerView: (drawerView: string) => void;
  closeDrawer: () => void;
  restoreBrowserTrackStates: () => void;
  fetchGenomeData: (genomeId: string) => void;
  replace: Replace;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  setDataFromUrlAndSave: (payload: ParsedUrlPayload) => void;
};

export const Browser = (props: BrowserProps) => {
  const [, setTrackStatesFromStorage] = useState<BrowserTrackStates>({});

  const { isDrawerOpened, closeDrawer } = props;
  const params: { [key: string]: string } = useParams();
  const location = useLocation();

  const setDataFromUrl = () => {
    const { genomeId } = params;
    const { focus = null, location = null } = props.browserQueryParams;
    const chrLocation = location ? getChrLocationFromStr(location) : null;

    if (
      !genomeId ||
      (genomeId === props.activeGenomeId &&
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

    if (focus && !chrLocation) {
      /*
       changeFocusObject needs to be called before setDataFromUrlAndSave
       in order to prevent creating an previouslyViewedObject entry
       for the focus object that is viewed first.
       */
      props.changeFocusObject(focus);
    } else if (focus && chrLocation) {
      props.changeFocusObject(focus);
      props.changeBrowserLocation({
        genomeId,
        ensObjectId: focus,
        chrLocation
      });
    } else if (chrLocation) {
      props.changeBrowserLocation({
        genomeId,
        ensObjectId: focus,
        chrLocation
      });
    }

    props.setDataFromUrlAndSave(payload);
  };

  const changeSelectedSpecies = useCallback(
    (genomeId: string) => {
      const { allChrLocations, allActiveEnsObjectIds } = props;
      const chrLocation = allChrLocations[genomeId];
      const activeEnsObjectId = allActiveEnsObjectIds[genomeId];

      const params = {
        genomeId,
        focus: activeEnsObjectId,
        location: chrLocation ? getChrLocationStr(chrLocation) : null
      };

      props.replace(urlFor.browser(params));
    },
    [props.allChrLocations, props.allActiveEnsObjectIds]
  );

  // handle url changes
  useEffect(() => {
    // handle navigation to /app/browser
    if (!params.genomeId) {
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
  }, [params.genomeId, location.search]);

  useEffect(() => {
    const { activeGenomeId, fetchGenomeData } = props;
    if (!activeGenomeId) {
      return;
    }
    fetchGenomeData(activeGenomeId);
    analyticsTracking.setSpeciesDimension(activeGenomeId);
  }, [props.activeGenomeId]);

  useEffect(() => {
    setTrackStatesFromStorage(browserStorageService.getTrackStates());
    props.restoreBrowserTrackStates();
  }, [props.activeGenomeId, props.activeEnsObjectId]);

  useEffect(() => {
    const {
      browserQueryParams: { location }
    } = props;
    const { genomeId } = params;
    const chrLocation = location ? getChrLocationFromStr(location) : null;

    if (props.browserActivated && genomeId && chrLocation) {
      props.changeBrowserLocation({ genomeId, chrLocation, ensObjectId: null });
    }
  }, [props.browserActivated]);

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
      return 'calc(41px + 0vw)'; // this format must be used for the react-spring animation to function properly
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

  const browserBar = <BrowserBar />;

  const shouldShowNavBar =
    props.browserActivated && props.browserNavOpened && !isDrawerOpened;

  if (!props.activeGenomeId) {
    return null;
  }

  return (
    <>
      <BrowserAppBar onSpeciesSelect={changeSelectedSpecies} />
      {!props.browserQueryParams.focus && (
        <section className={styles.browser}>
          {browserBar}
          <ExampleObjectLinks {...props} />
        </section>
      )}
      {!!props.browserQueryParams.focus && (
        <section className={styles.browser}>
          {browserBar}
          <div
            className={`${styles.browserInnerWrapper} ${getHeightClass(
              props.launchbarExpanded
            )}`}
          >
            <animated.div style={trackAnimation}>
              <div className={styles.browserImageWrapper} onClick={closeTrack}>
                {shouldShowNavBar && <BrowserNavBar />}
                <BrowserImage />
              </div>
            </animated.div>
            <TrackPanel />
          </div>
        </section>
      )}
    </>
  );
};

export const ExampleObjectLinks = (props: BrowserProps) => {
  const { activeGenomeId } = props;

  if (!activeGenomeId) {
    return null;
  }

  const links = props.exampleEnsObjects.map((exampleObject: EnsObject) => {
    const path = urlFor.browser({
      genomeId: activeGenomeId,
      focus: exampleObject.object_id
    });

    return (
      <div key={exampleObject.object_id} className={styles.exampleLink}>
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

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  activeEnsObjectId: getBrowserActiveEnsObjectId(state),
  allActiveEnsObjectIds: getBrowserActiveEnsObjectIds(state),
  allChrLocations: getAllChrLocations(state),
  browserActivated: getBrowserActivated(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserQueryParams: getBrowserQueryParams(state),
  chrLocation: getChrLocation(state),
  isDrawerOpened: getIsDrawerOpened(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  committedSpecies: getEnabledCommittedSpecies(state)
});

const mapDispatchToProps = {
  changeBrowserLocation,
  changeFocusObject,
  changeDrawerView,
  closeDrawer,
  fetchGenomeData,
  replace,
  toggleDrawer,
  setDataFromUrlAndSave,
  restoreBrowserTrackStates
};

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
