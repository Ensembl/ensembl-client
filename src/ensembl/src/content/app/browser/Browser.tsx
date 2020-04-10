/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace, Replace } from 'connected-react-router';
import { Link } from 'react-router-dom';
import upperFirst from 'lodash/upperFirst';

import useBrowserRouting from './hooks/useBrowserRouting';

import analyticsTracking from 'src/services/analytics-service';
import browserStorageService from './browser-storage-service';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { BrowserTrackStates } from './track-panel/trackPanelConfig';
import { BreakpointWidth } from 'src/global/globalConfig';

import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getChrLocationFromStr, getChrLocationStr } from './browserHelper';

import {
  changeBrowserLocation,
  changeFocusObject,
  setDataFromUrlAndSave,
  ParsedUrlPayload,
  restoreBrowserTrackStates,
} from './browserActions';
import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { toggleTrackPanel } from 'src/content/app/browser/track-panel/trackPanelActions';
import { toggleDrawer } from './drawer/drawerActions';

import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserQueryParams,
  getBrowserActiveEnsObjectId,
  getBrowserActiveEnsObjectIds,
  getAllChrLocations,
} from './browserSelectors';
import { getIsTrackPanelOpened } from './track-panel/trackPanelSelectors';
import { getIsDrawerOpened } from './drawer/drawerSelectors';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getExampleEnsObjects } from 'src/shared/state/ens-object/ensObjectSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';

import BrowserBar from './browser-bar/BrowserBar';
import BrowserImage from './browser-image/BrowserImage';
import BrowserNavBar from './browser-nav/BrowserNavBar';
import TrackPanel from './track-panel/TrackPanel';
import TrackPanelBar from './track-panel/track-panel-bar/TrackPanelBar';
import TrackPanelTabs from './track-panel/track-panel-tabs/TrackPanelTabs';
import BrowserAppBar from './browser-app-bar/BrowserAppBar';
import Drawer from './drawer/Drawer';
import { StandardAppLayout } from 'src/shared/components/layout';

import { RootState } from 'src/store';
import { ChrLocation, ChrLocations } from './browserState';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import 'ensembl-genome-browser';

import styles from './Browser.scss';

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
  exampleEnsObjects: EnsObject[];
  committedSpecies: CommittedItem[];
  viewportWidth: BreakpointWidth;
  changeBrowserLocation: (locationData: {
    genomeId: string;
    ensObjectId: string | null;
    chrLocation: ChrLocation;
  }) => void;
  changeFocusObject: (objectId: string) => void;
  restoreBrowserTrackStates: () => void;
  fetchGenomeData: (genomeId: string) => void;
  replace: Replace;
  toggleTrackPanel: (isOpen: boolean) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  setDataFromUrlAndSave: (payload: ParsedUrlPayload) => void;
};

export const Browser = (props: BrowserProps) => {
  const [, setTrackStatesFromStorage] = useState<BrowserTrackStates>({});
  const { changeGenomeId } = useBrowserRouting();

  const { isDrawerOpened } = props;
  const params: { [key: string]: string } = useParams();
  const location = useLocation();

  // const setDataFromUrl = () => {
  //   const { genomeId } = params;
  //   const { focus = null, location = null } = props.browserQueryParams;
  //   const chrLocation = location ? getChrLocationFromStr(location) : null;

  //   if (
  //     !genomeId ||
  //     (genomeId === props.activeGenomeId &&
  //       focus === props.activeEnsObjectId &&
  //       isEqual(chrLocation, props.chrLocation))
  //   ) {
  //     return;
  //   }

  //   const payload = {
  //     activeGenomeId: genomeId,
  //     activeEnsObjectId: focus || null,
  //     chrLocation,
  //   };

  //   if (focus && !chrLocation) {
  //     /*
  //      changeFocusObject needs to be called before setDataFromUrlAndSave
  //      in order to prevent creating an previouslyViewedObject entry
  //      for the focus object that is viewed first.
  //      */
  //     props.changeFocusObject(focus);
  //   } else if (focus && chrLocation) {
  //     props.changeFocusObject(focus);
  //     props.changeBrowserLocation({
  //       genomeId,
  //       ensObjectId: focus,
  //       chrLocation,
  //     });
  //   } else if (chrLocation) {
  //     props.changeBrowserLocation({
  //       genomeId,
  //       ensObjectId: focus,
  //       chrLocation,
  //     });
  //   }

  //   props.setDataFromUrlAndSave(payload);
  // };

  // const changeSelectedSpecies = useCallback(
  //   (genomeId: string) => {
  //     const { allChrLocations, allActiveEnsObjectIds } = props;
  //     const chrLocation = allChrLocations[genomeId];
  //     const activeEnsObjectId = allActiveEnsObjectIds[genomeId];

  //     const params = {
  //       genomeId,
  //       focus: activeEnsObjectId,
  //       location: chrLocation ? getChrLocationStr(chrLocation) : null,
  //     };

  //     props.replace(urlFor.browser(params));
  //   },
  //   [props.allChrLocations, props.allActiveEnsObjectIds]
  // );

  // // handle url changes
  // useEffect(() => {
  //   // handle navigation to /app/browser
  //   if (!params.genomeId) {
  //     // select either the species that the user viewed during the previous visit,
  //     // of the first selected species
  //     const { activeGenomeId, committedSpecies } = props;
  //     if (
  //       activeGenomeId &&
  //       find(
  //         committedSpecies,
  //         ({ genome_id }: CommittedItem) => genome_id === activeGenomeId
  //       )
  //     ) {
  //       changeSelectedSpecies(activeGenomeId);
  //     } else {
  //       if (committedSpecies[0]) {
  //         changeSelectedSpecies(committedSpecies[0].genome_id);
  //       }
  //     }
  //   } else {
  //     // handle navigation to /app/browser/:genomeId?focus=:focus&location=:location
  //     setDataFromUrl();
  //   }
  // }, [params.genomeId, location.search]);

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
      browserQueryParams: { location },
    } = props;
    const { genomeId } = params;
    const chrLocation = location ? getChrLocationFromStr(location) : null;

    if (props.browserActivated && genomeId && chrLocation) {
      props.changeBrowserLocation({ genomeId, chrLocation, ensObjectId: null });
    }
  }, [props.browserActivated]);

  const onSidebarToggle = () => {
    props.toggleTrackPanel(!props.isTrackPanelOpened); // FIXME
  };

  const toggleDrawer = () => {
    props.toggleDrawer(!props.isDrawerOpened);
  };

  const shouldShowNavBar =
    props.browserActivated && props.browserNavOpened && !isDrawerOpened;

  if (!props.activeGenomeId) {
    return null;
  }

  const mainContent = (
    <>
      {shouldShowNavBar && <BrowserNavBar />}
      <BrowserImage />
    </>
  );

  return (
    <div className={styles.browserInnerWrapper}>
      <BrowserAppBar onSpeciesSelect={changeGenomeId} />
      {props.browserQueryParams.focus ? (
        <StandardAppLayout
          mainContent={mainContent}
          sidebarContent={<TrackPanel />}
          sidebarNavigation={<TrackPanelTabs />}
          sidebarToolstripContent={<TrackPanelBar />}
          onSidebarToggle={onSidebarToggle}
          topbarContent={<BrowserBar />}
          isSidebarOpen={props.isTrackPanelOpened}
          isDrawerOpen={props.isDrawerOpened}
          drawerContent={<Drawer />}
          onDrawerClose={toggleDrawer}
          viewportWidth={props.viewportWidth}
        />
      ) : (
        <ExampleObjectLinks {...props} />
      )}
    </div>
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
      focus: exampleObject.object_id,
    });

    return (
      <div key={exampleObject.object_id} className={styles.exampleLink}>
        <Link to={path}>
          <span className={styles.objectType}>
            {upperFirst(exampleObject.type)}
          </span>
          <span className={styles.objectLabel}>{exampleObject.label}</span>
        </Link>
      </div>
    );
  });

  return (
    <div>
      <div className={styles.exampleLinks__emptyTopbar} />
      <div className={styles.exampleLinks}>{links}</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return {
    activeGenomeId,
    activeEnsObjectId: getBrowserActiveEnsObjectId(state),
    allActiveEnsObjectIds: getBrowserActiveEnsObjectIds(state),
    allChrLocations: getAllChrLocations(state),
    browserActivated: getBrowserActivated(state),
    browserNavOpened: getBrowserNavOpened(state),
    browserQueryParams: getBrowserQueryParams(state),
    chrLocation: getChrLocation(state),
    isDrawerOpened: getIsDrawerOpened(state),
    isTrackPanelOpened: getIsTrackPanelOpened(state),
    exampleEnsObjects: getExampleEnsObjects(state),
    committedSpecies: getEnabledCommittedSpecies(state),
    viewportWidth: getBreakpointWidth(state),
  };
};

const mapDispatchToProps = {
  changeBrowserLocation,
  changeFocusObject,
  fetchGenomeData,
  replace,
  toggleDrawer,
  setDataFromUrlAndSave,
  restoreBrowserTrackStates,
  toggleTrackPanel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
