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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import upperFirst from 'lodash/upperFirst';

import useBrowserRouting from './hooks/useBrowserRouting';

import analyticsTracking from 'src/services/analytics-service';
import browserStorageService from './browser-storage-service';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { BrowserTrackStates } from './track-panel/trackPanelConfig';
import { BreakpointWidth } from 'src/global/globalConfig';

import {
  parseEnsObjectId,
  buildFocusIdForUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';
import { getChrLocationFromStr } from './browserHelper';

import {
  changeBrowserLocation,
  restoreBrowserTrackStates
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
  getBrowserActiveEnsObjectIds
} from './browserSelectors';
import { getIsTrackPanelOpened } from './track-panel/trackPanelSelectors';
import { getIsDrawerOpened } from './drawer/drawerSelectors';
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
import { ChrLocation } from './browserState';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import 'ensembl-genome-browser';

import styles from './Browser.scss';

export type BrowserProps = {
  activeGenomeId: string | null;
  activeEnsObjectId: string | null;
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserQueryParams: { [key: string]: string };
  chrLocation: ChrLocation | null;
  isDrawerOpened: boolean;
  isTrackPanelOpened: boolean;
  exampleEnsObjects: EnsObject[];
  viewportWidth: BreakpointWidth;
  changeBrowserLocation: (locationData: {
    genomeId: string;
    ensObjectId: string | null;
    chrLocation: ChrLocation;
  }) => void;
  restoreBrowserTrackStates: () => void;
  fetchGenomeData: (genomeId: string) => void;
  toggleTrackPanel: (isOpen: boolean) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
};

export const Browser = (props: BrowserProps) => {
  const [, setTrackStatesFromStorage] = useState<BrowserTrackStates>({});
  const { changeGenomeId } = useBrowserRouting();

  const { isDrawerOpened } = props;
  const params: { [key: string]: string } = useParams();

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
    const parsedEnsObjectId = parseEnsObjectId(exampleObject.object_id);
    const focusId = buildFocusIdForUrl(parsedEnsObjectId);
    const path = urlFor.browser({
      genomeId: activeGenomeId,
      focus: focusId
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
    browserActivated: getBrowserActivated(state),
    browserNavOpened: getBrowserNavOpened(state),
    browserQueryParams: getBrowserQueryParams(state),
    chrLocation: getChrLocation(state),
    isDrawerOpened: getIsDrawerOpened(state),
    isTrackPanelOpened: getIsTrackPanelOpened(state),
    exampleEnsObjects: getExampleEnsObjects(state),
    viewportWidth: getBreakpointWidth(state)
  };
};

const mapDispatchToProps = {
  changeBrowserLocation,
  fetchGenomeData,
  toggleDrawer,
  restoreBrowserTrackStates,
  toggleTrackPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
