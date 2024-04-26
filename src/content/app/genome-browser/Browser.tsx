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

import { useEffect, memo, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppDispatch, useAppSelector } from 'src/store';
import useBrowserRouting from './hooks/useBrowserRouting';
import useGenomeBrowserTracks from './hooks/useGenomeBrowserTracks';
import useGenomeBrowserIds from 'src/content/app/genome-browser/hooks/useGenomeBrowserIds';

import { toggleTrackPanel } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { deleteBrowserActiveFocusObjectIdAndSave } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import { getBrowserActiveGenomeId } from './state/browser-general/browserGeneralSelectors';
import { getIsTrackPanelOpened } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { getIsBrowserSidebarModalOpened } from './state/browser-sidebar-modal/browserSidebarModalSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { getGenomeById } from 'src/shared/state/genome/genomeSelectors';

import BrowserBar from './components/browser-bar/BrowserBar';
import BrowserImage from './components/browser-image/BrowserImage';
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

import { GenomeBrowserProvider } from './contexts/GenomeBrowserContext';
import { GenomeBrowserIdsProvider } from './contexts/genome-browser-ids-context/GenomeBrowserIdsContext';

import styles from './Browser.module.css';

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
  const location = urlSearchParams.get('location') || null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { changeGenomeId } = useBrowserRouting();
  const {
    genomeIdInUrl,
    focusObjectIdInUrl,
    isMissingGenomeId,
    isMalformedFocusObjectId,
    isMissingFocusObject,
    isInvalidLocation,
    resetValidator
  } = useGenomeBrowserIds();

  useGenomeBrowserTracks();

  useEffect(() => {
    if (!activeGenomeId) {
      return;
    }
  }, [activeGenomeId]);

  const onSidebarToggle = () => {
    dispatch(toggleTrackPanel(!isTrackPanelOpened));
  };

  const onDrawerClose = () => {
    dispatch(closeDrawer());
  };

  const openGenomeBrowserInterstitial = () => {
    const interstitialUrl = urlFor.browser({
      genomeId: genomeIdInUrl
    });
    resetValidator();
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
      ) : location && isInvalidLocation ? (
        <MissingFeatureError
          featureId={location}
          genome={genome}
          showTopBar={true}
          onContinue={openGenomeBrowserInterstitial}
        />
      ) : activeGenomeId && focus ? (
        <StandardAppLayout
          mainContent={<BrowserImage />}
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

const SidebarContent = () => {
  const isBrowserSidebarModalOpened = useAppSelector(
    getIsBrowserSidebarModalOpened
  );

  return isBrowserSidebarModalOpened ? <BrowserSidebarModal /> : <TrackPanel />;
};

const GenomeBrowserInitContainer = () => {
  const browser = useMemo(() => {
    return <Browser />;
  }, []);

  return (
    <GenomeBrowserProvider>
      <GenomeBrowserIdsProvider>{browser}</GenomeBrowserIdsProvider>
    </GenomeBrowserProvider>
  );
};

export default memo(GenomeBrowserInitContainer);
