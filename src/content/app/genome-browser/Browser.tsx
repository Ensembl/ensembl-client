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
import { useLocation, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import EnsemblGenomeBrowser from '@ensembl/ensembl-genome-browser';

import { useAppDispatch, useAppSelector } from 'src/store';
import useBrowserRouting from './hooks/useBrowserRouting';
import useGenomeBrowser from './hooks/useGenomeBrowser';
import useGenomeBrowserTracks from './hooks/useGenomeBrowserTracks';
import useGenomeBrowserUrlCheck from 'src/content/app/genome-browser/hooks/useGenomeBrowserUrlCheck';

import { toggleTrackPanel } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { deleteBrowserActiveFocusObjectIdAndSave } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import { getBrowserNavOpenState } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';
import { getBrowserActiveGenomeId } from './state/browser-general/browserGeneralSelectors';
import { getIsTrackPanelOpened } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { getIsBrowserSidebarModalOpened } from './state/browser-sidebar-modal/browserSidebarModalSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { getGenomeById } from 'src/shared/state/genome/genomeSelectors';

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
import MissingGenomeError from 'src/shared/components/error-screen/url-errors/MissingGenomeError';
import MissingFeatureError from 'src/shared/components/error-screen/url-errors/MissingFeatureError';

import type { StateZmenu } from 'src/content/app/genome-browser/components/zmenu/ZmenuController';
import type { CogList } from './state/track-settings/trackSettingsSlice';

import styles from './Browser.scss';

export const Browser = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const isDrawerOpened = useAppSelector(getIsDrawerOpened);
  const isTrackPanelOpened = useAppSelector(getIsTrackPanelOpened);
  const viewportWidth = useAppSelector(getBreakpointWidth);
  const genome = useAppSelector((state) =>
    getGenomeById(state, activeGenomeId ?? '')
  );

  const { search } = useLocation(); // from document.location provided by the router
  const urlSearchParams = new URLSearchParams(search);
  const focus = urlSearchParams.get('focus') || null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { changeGenomeId } = useBrowserRouting();
  const {
    genomeIdInUrl,
    focusObjectIdInUrl,
    isMissingGenomeId,
    isMalformedFocusObjectId,
    isMissingFocusObject
  } = useGenomeBrowserUrlCheck();

  useGenomeBrowserTracks();

  useEffect(() => {
    if (!activeGenomeId) {
      return;
    }
  }, [activeGenomeId]);

  const onSidebarToggle = () => {
    dispatch(toggleTrackPanel(!isTrackPanelOpened)); // FIXME
  };

  const onDrawerClose = () => {
    dispatch(closeDrawer());
  };

  const openGenomeBrowserInterstitial = () => {
    const interstitialUrl = urlFor.browser({
      genomeId: genomeIdInUrl
    });
    dispatch(deleteBrowserActiveFocusObjectIdAndSave());
    navigate(interstitialUrl);
  };

  return (
    <div className={styles.genomeBrowser}>
      <BrowserAppBar onSpeciesSelect={changeGenomeId} />
      {isMissingGenomeId ? (
        <MissingGenomeError genomeId={genomeIdInUrl as string} />
      ) : isMalformedFocusObjectId || isMissingFocusObject ? (
        <MissingFeatureError
          featureId={focusObjectIdInUrl as string}
          genome={genome}
          showTopBar={true}
          onContinue={openGenomeBrowserInterstitial}
        />
      ) : activeGenomeId && focus ? (
        <StandardAppLayout
          mainContent={<MainContent />}
          sidebarContent={<SidebarContent />}
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

const MainContent = () => {
  const browserNavOpenState = useAppSelector(getBrowserNavOpenState);
  const isDrawerOpened = useAppSelector(getIsDrawerOpened);
  const { genomeBrowser } = useGenomeBrowser();

  const shouldShowNavBar = Boolean(
    genomeBrowser && browserNavOpenState && !isDrawerOpened
  );

  return (
    <>
      {shouldShowNavBar && <BrowserNavBar />}
      <BrowserImage />
    </>
  );
};

const SidebarContent = () => {
  const isBrowserSidebarModalOpened = useAppSelector(
    getIsBrowserSidebarModalOpened
  );

  return isBrowserSidebarModalOpened ? <BrowserSidebarModal /> : <TrackPanel />;
};

type GenomeBrowserContextType = {
  genomeBrowser: EnsemblGenomeBrowser | null;
  setGenomeBrowser: (genomeBrowser: EnsemblGenomeBrowser | null) => void;
  zmenus: StateZmenu;
  setZmenus: (zmenus: StateZmenu) => void;
  cogList: CogList | null;
  setCogList: (cogList: CogList) => void;
};

export const GenomeBrowserContext = React.createContext<
  GenomeBrowserContextType | undefined
>(undefined);

const GenomeBrowserInitContainer = () => {
  const [genomeBrowser, setGenomeBrowser] =
    useState<EnsemblGenomeBrowser | null>(null);

  const [zmenus, setZmenus] = useState<StateZmenu>({});
  const [cogList, setCogList] = useState<CogList | null>(null);

  const browser = useMemo(() => {
    return <Browser />;
  }, []);

  return (
    <GenomeBrowserContext.Provider
      value={{
        genomeBrowser,
        setGenomeBrowser,
        zmenus,
        setZmenus,
        cogList,
        setCogList
      }}
    >
      {browser}
    </GenomeBrowserContext.Provider>
  );
};

export default memo(GenomeBrowserInitContainer);
