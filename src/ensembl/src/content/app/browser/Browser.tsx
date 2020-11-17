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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import useBrowserRouting from './hooks/useBrowserRouting';

import analyticsTracking from 'src/services/analytics-service';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { BreakpointWidth } from 'src/global/globalConfig';

import {
  parseEnsObjectId,
  buildFocusIdForUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { toggleTrackPanel } from 'src/content/app/browser/track-panel/trackPanelActions';
import { toggleDrawer } from './drawer/drawerActions';
import { ensureSpeciesIsEnabled } from 'src/content/app/species-selector/state/speciesSelectorActions';

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
import ErrorBoundary from 'src/shared/components/error-boundary/ErrorBoundary';
import { NewTechError } from 'src/shared/components/error-screen';

import { RootState } from 'src/store';
import { ChrLocation } from './browserState';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

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
  fetchGenomeData: (genomeId: string) => void;
  ensureSpeciesIsEnabled: (genomeId: string) => void;
  toggleTrackPanel: (isOpen: boolean) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
};

export const Browser = (props: BrowserProps) => {
  const { changeGenomeId } = useBrowserRouting();

  const { isDrawerOpened } = props;

  useEffect(() => {
    const { activeGenomeId, fetchGenomeData } = props;
    if (!activeGenomeId) {
      return;
    }

    fetchGenomeData(activeGenomeId);
    props.ensureSpeciesIsEnabled(activeGenomeId);
    analyticsTracking.setSpeciesDimension(activeGenomeId);
  }, [props.activeGenomeId]);

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
        <Link to={path}>Example {exampleObject.type}</Link>
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
  fetchGenomeData,
  toggleDrawer,
  ensureSpeciesIsEnabled,
  toggleTrackPanel
};

const ReduxConnectedBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(Browser);

const WasmLoadingBrowserContainer = () => {
  useEffect(() => {
    /* eslint-disable */
    // @ts-ignore ensembl-genome-browser does not have typescript definitions
    import('ensembl-genome-browser');
    /* eslint-enable */
  });

  return <ReduxConnectedBrowser />;
};

const ErrorWrappedBrowser = () => {
  // if an error happens during loading of the browser,
  // we will be able to show custom error string
  return (
    <ErrorBoundary fallbackComponent={NewTechError}>
      <WasmLoadingBrowserContainer />
    </ErrorBoundary>
  );
};

export default ErrorWrappedBrowser;
