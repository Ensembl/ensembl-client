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
import { ApolloProvider } from '@apollo/client';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import useBrowserRouting from './hooks/useBrowserRouting';

import { client } from 'src/gql-client';
import analyticsTracking from 'src/services/analytics-service';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { BreakpointWidth } from 'src/global/globalConfig';
import GenomeBrowserService from 'src/content/app/browser/browser-messaging-service';

import {
  parseEnsObjectId,
  buildFocusIdForUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';

import { toggleTrackPanel } from 'src/content/app/browser/track-panel/trackPanelActions';
import { toggleDrawer } from './drawer/drawerActions';

import {
  getBrowserNavOpenState,
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
  browserNavOpenState: boolean;
  browserQueryParams: { [key: string]: string };
  chrLocation: ChrLocation | null;
  isDrawerOpened: boolean;
  isTrackPanelOpened: boolean;
  exampleEnsObjects: EnsObject[];
  viewportWidth: BreakpointWidth;
  toggleTrackPanel: (isOpen: boolean) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
};

export const Browser = (props: BrowserProps) => {
  const { changeGenomeId } = useBrowserRouting();

  const { isDrawerOpened } = props;

  useEffect(() => {
    const { activeGenomeId } = props;
    if (!activeGenomeId) {
      return;
    }

    analyticsTracking.setSpeciesDimension(activeGenomeId);
  }, [props.activeGenomeId]);

  const onSidebarToggle = () => {
    props.toggleTrackPanel(!props.isTrackPanelOpened); // FIXME
  };

  const toggleDrawer = () => {
    props.toggleDrawer(!isDrawerOpened);
  };

  const shouldShowNavBar = true;
  // props.browserActivated && props.browserNavOpenState && !isDrawerOpened;

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
    <ApolloProvider client={client}>
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
            isDrawerOpen={isDrawerOpened}
            drawerContent={<Drawer />}
            onDrawerClose={toggleDrawer}
            viewportWidth={props.viewportWidth}
          />
        ) : (
          <ExampleObjectLinks {...props} />
        )}
      </div>
    </ApolloProvider>
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
        <Link to={path} replace>
          Example {exampleObject.type}
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
    browserNavOpenState: getBrowserNavOpenState(state),
    browserQueryParams: getBrowserQueryParams(state),
    chrLocation: getChrLocation(state),
    isDrawerOpened: getIsDrawerOpened(state),
    isTrackPanelOpened: getIsTrackPanelOpened(state),
    exampleEnsObjects: getExampleEnsObjects(state),
    viewportWidth: getBreakpointWidth(state)
  };
};

const mapDispatchToProps = {
  toggleDrawer,
  toggleTrackPanel
};

const ReduxConnectedBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(Browser);

export const GenomeBrowserContext = React.createContext<{
  genomeBrowser?: GenomeBrowserService | null;
  setGenomeBrowser?: (genomeBrowser: GenomeBrowserService) => void;
}>({});

const GenomeBrowserInitContainer = () => {
  const [genomeBrowser, setGenomeBrowser] =
    useState<GenomeBrowserService | null>(null);

  return (
    <GenomeBrowserContext.Provider value={{ genomeBrowser, setGenomeBrowser }}>
      <ReduxConnectedBrowser /> ;
    </GenomeBrowserContext.Provider>
  );
};

const ErrorWrappedBrowser = () => {
  // if an error happens during loading of the browser,
  // we will be able to show custom error string
  return (
    <ErrorBoundary fallbackComponent={NewTechError}>
      <GenomeBrowserInitContainer />
    </ErrorBoundary>
  );
};

export default ErrorWrappedBrowser;
