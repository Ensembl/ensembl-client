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
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import EnsemblGenomeBrowser from '@ensembl/ensembl-genome-browser';

import useBrowserRouting from './hooks/useBrowserRouting';
import useGenomeBrowser from './hooks/useGenomeBrowser';

import analyticsTracking from 'src/services/analytics-service';

import { toggleTrackPanel } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import { getBrowserNavOpenState } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';
import { getBrowserActiveGenomeId } from './state/browser-general/browserGeneralSelectors';
import { getIsTrackPanelOpened } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { getIsBrowserSidebarModalOpened } from './state/browser-sidebar-modal/browserSidebarModalSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';

import BrowserBar from './components/browser-bar/BrowserBar';
import BrowserImage from './components/browser-image/BrowserImage';
import BrowserNavBar from './components/browser-nav/BrowserNavBar';
import BrowserSidebarToolstrip from './components/browser-sidebar-toolstrip/BrowserSidebarToolstrip';
import BrowserSidebarModal from './components/browser-sidebar-modal/BrowserSidebarModal';
import TrackPanel from './components/track-panel/TrackPanel';
import TrackPanelTabs from './components/track-panel/components/track-panel-tabs/TrackPanelTabs';
import BrowserAppBar from './components/browser-app-bar/BrowserAppBar';
import Drawer from './components/drawer/Drawer';
import { StandardAppLayout } from 'src/shared/components/layout';
import BrowserInterstitial from './components/interstitial/BrowserInterstitial';

import { StateZmenu } from 'src/content/app/genome-browser/components/zmenu/ZmenuController';

import styles from './Browser.scss';

export const Browser = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const browserNavOpenState = useSelector(getBrowserNavOpenState);
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const isTrackPanelOpened = useSelector(getIsTrackPanelOpened);
  const isBrowserSidebarModalOpened = useSelector(
    getIsBrowserSidebarModalOpened
  );
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
    dispatch(closeDrawer());
  };

  const shouldShowNavBar =
    genomeBrowser && browserNavOpenState && !isDrawerOpened;

  const mainContent = (
    <>
      {shouldShowNavBar && <BrowserNavBar />}
      <BrowserImage />
    </>
  );

  const SideBarContent = isBrowserSidebarModalOpened ? (
    <BrowserSidebarModal />
  ) : (
    <TrackPanel />
  );

  return (
    <div className={styles.genomeBrowser}>
      <BrowserAppBar onSpeciesSelect={changeGenomeId} />
      {activeGenomeId && focus ? (
        <StandardAppLayout
          mainContent={mainContent}
          sidebarContent={SideBarContent}
          sidebarNavigation={<TrackPanelTabs />}
          sidebarToolstripContent={<BrowserSidebarToolstrip />}
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
  );
};

type GenomeBrowserContextType = {
  genomeBrowser: EnsemblGenomeBrowser | null;
  setGenomeBrowser: (genomeBrowser: EnsemblGenomeBrowser | null) => void;
  zmenus: StateZmenu;
  setZmenus: (zmenus: StateZmenu) => void;
};

export const GenomeBrowserContext = React.createContext<
  GenomeBrowserContextType | undefined
>(undefined);

const GenomeBrowserInitContainer = () => {
  const [genomeBrowser, setGenomeBrowser] =
    useState<EnsemblGenomeBrowser | null>(null);

  const [zmenus, setZmenus] = useState<StateZmenu>({});

  const browser = useMemo(() => {
    return <Browser />;
  }, []);

  return (
    <GenomeBrowserContext.Provider
      value={{
        genomeBrowser,
        setGenomeBrowser,
        zmenus,
        setZmenus
      }}
    >
      {browser}
    </GenomeBrowserContext.Provider>
  );
};

export default memo(GenomeBrowserInitContainer);
