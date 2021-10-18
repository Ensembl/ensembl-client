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

import React, { useEffect, useState, memo, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import EnsemblGenomeBrowser from 'ensembl-genome-browser';

import useBrowserRouting from './hooks/useBrowserRouting';
import useGenomeBrowser from './hooks/useGenomeBrowser';

import { client } from 'src/gql-client';
import analyticsTracking from 'src/services/analytics-service';

import { toggleTrackPanel } from 'src/content/app/browser/track-panel/trackPanelActions';
import { toggleDrawer } from './drawer/drawerActions';
import {
  getBrowserNavOpenState,
  getBrowserActiveGenomeId
} from './browserSelectors';
import { getIsTrackPanelOpened } from './track-panel/trackPanelSelectors';
import { getIsDrawerOpened } from './drawer/drawerSelectors';
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
import BrowserInterstitial from './interstitial/BrowserInterstitial';

import { StateZmenu } from 'src/content/app/browser/zmenu/ZmenuController';

import styles from './Browser.scss';

export const Browser = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const browserNavOpenState = useSelector(getBrowserNavOpenState);
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const isTrackPanelOpened = useSelector(getIsTrackPanelOpened);
  const viewportWidth = useSelector(getBreakpointWidth);

  const { search } = useLocation(); // from document.location provided by the router
  const urlSearchParams = new URLSearchParams(search);
  const focus = urlSearchParams.get('focus') || null;

  const dispatch = useDispatch();
  const { changeGenomeId } = useBrowserRouting();
  const { genomeBrowser } = useGenomeBrowser();

  useEffect(() => {
    if (!activeGenomeId) {
      return;
    }

    analyticsTracking.setSpeciesDimension(activeGenomeId);
  }, [activeGenomeId]);

  const onSidebarToggle = () => {
    dispatch(toggleTrackPanel(!isTrackPanelOpened)); // FIXME
  };

  const onDrawerClose = () => {
    dispatch(toggleDrawer(!isDrawerOpened));
  };

  const shouldShowNavBar =
    genomeBrowser && browserNavOpenState && !isDrawerOpened;

  const mainContent = useMemo(
    () => (
      <>
        {shouldShowNavBar && <BrowserNavBar />}
        <BrowserImage />
      </>
    ),
    [shouldShowNavBar]
  );

  return (
    <ApolloProvider client={client}>
      <div className={styles.genomeBrowser}>
        <BrowserAppBar onSpeciesSelect={changeGenomeId} />
        {activeGenomeId && focus ? (
          <StandardAppLayout
            mainContent={mainContent}
            sidebarContent={<TrackPanel />}
            sidebarNavigation={<TrackPanelTabs />}
            sidebarToolstripContent={<TrackPanelBar />}
            onSidebarToggle={onSidebarToggle}
            topbarContent={<BrowserBar />}
            isSidebarOpen={isTrackPanelOpened}
            isDrawerOpen={isDrawerOpened}
            drawerContent={<Drawer />}
            onDrawerClose={onDrawerClose}
            viewportWidth={viewportWidth}
          />
        ) : (
          <BrowserInterstitial />
        )}
      </div>
    </ApolloProvider>
  );
};

type GenomeBrowserContextType = {
  genomeBrowser: EnsemblGenomeBrowser;
  setGenomeBrowser: (genomeBrowser: EnsemblGenomeBrowser) => void;
  zmenus: StateZmenu;
  setZmenus: (zmenus: StateZmenu) => void;
};

export const GenomeBrowserContext = React.createContext<
  GenomeBrowserContextType | undefined
>(undefined);

const GenomeBrowserInitContainer = () => {
  const [genomeBrowser, setGenomeBrowser] = useState<EnsemblGenomeBrowser>();

  const [zmenus, setZmenus] = useState<StateZmenu>({});

  const browser = useMemo(() => {
    return <Browser />;
  }, []);

  return (
    <GenomeBrowserContext.Provider
      value={
        {
          genomeBrowser,
          setGenomeBrowser,
          zmenus,
          setZmenus
        } as GenomeBrowserContextType
      }
    >
      {browser}
    </GenomeBrowserContext.Provider>
  );
};

export default memo(GenomeBrowserInitContainer, isEqual);
