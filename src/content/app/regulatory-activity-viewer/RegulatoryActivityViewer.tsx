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

import { memo } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import {
  getMainContentBottomView,
  getIsEpigenomeSelectorOpen,
  getIsSidebarOpen
} from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import useActivityViewerIds from './hooks/useActivityViewerIds';
import usePreselectedEpigenomes from './hooks/usePreselectedEpigenomes';
import useActivityViewerRouting from './hooks/useActivityViewerRouting';
import { useRegulatoryDataAvailabilityQuery } from './state/api/activityViewerApiSlice';

import {
  openSidebar,
  closeSidebar
} from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

import ActivityViewerEpigenomesContextProvider from 'src/content/app/regulatory-activity-viewer/contexts/ActivityViewerEpigenomesContextProvider';
import { StandardAppLayout } from 'src/shared/components/layout';
import ActivityViewerAppBar from './components/activity-viewer-app-bar/ActivityViewerAppBar';
import ActivityViewerInterstitial from './components/activity-viewer-interstitial/ActivityViewerInterstitial';
import NoActivityData from './components/no-activity-data/NoActivityData';
import ActivityViewerFocusFeatureInfo from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-focus-feature-info/ActivityViewerFocusFeatureInfo';
import RegionOverview from './components/region-overview/RegionOverview';
import RegionActivitySection from './components/region-activity-section/RegionActivitySection';
import ActivityViewerSidebar from './components/activity-viewer-sidebar/ActivityViewerSidebar';
import SidebarNavigation from './components/activity-viewer-sidebar/sidebar-navigation/SidebarNavigation';
import MainContentBottomViewControls from './components/main-content-bottom-view-controls/MainContentBottomViewControls';
import EpigenomeSelectionModal from './components/epigenome-selection-modal/EpigenomeSelectionModal';
import SelectedEpigenomes from './components/selected-epigenomes/SelectedEpigenomes';

import styles from './RegulatoryActivityViewer.module.css';

const ActivityViewer = () => {
  const { genomeId, assemblyAccessionId, genomeIdInUrl, location } =
    useActivityViewerIds();
  const isSidebarOpen = useAppSelector((state) =>
    getIsSidebarOpen(state, genomeId ?? '')
  );
  useActivityViewerRouting();
  usePreselectedEpigenomes();
  const dispatch = useAppDispatch();

  const {
    isFetching: isRegulatoryAvailabilityDataLoading,
    currentData: regulatoryAvailabilityData
  } = useRegulatoryDataAvailabilityQuery(
    {
      assemblyId: assemblyAccessionId ?? ''
    },
    {
      skip: !assemblyAccessionId
    }
  );

  const isRegulatoryDataAvailable = regulatoryAvailabilityData?.available;

  const toggleSidebar = () => {
    if (!genomeId) {
      // this should not happen
      return;
    }
    if (isSidebarOpen) {
      dispatch(closeSidebar({ genomeId }));
    } else {
      dispatch(openSidebar({ genomeId }));
    }
  };

  if (!genomeIdInUrl) {
    // TODO: add a proper component for this
    return (
      <div className={styles.container}>
        <ActivityViewerAppBar />
        <div>Please select species.</div>
      </div>
    );
  } else if (
    isRegulatoryAvailabilityDataLoading ||
    !isRegulatoryDataAvailable
  ) {
    return (
      <div className={styles.container}>
        <NoActivityData isLoading={isRegulatoryAvailabilityDataLoading} />
      </div>
    );
  } else if (!location) {
    // NOTE: currently, regulatory activity data is fetched based on location.
    // In the future, it should be possible to fetch regulatory data based on gene or regulatory feature
    return (
      <div className={styles.container}>
        <ActivityViewerAppBar />
        <ActivityViewerInterstitial />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ActivityViewerAppBar />
      <StandardAppLayout
        mainContent={<MainContent genomeId={genomeId ?? null} />}
        sidebarContent={<ActivityViewerSidebar genomeId={genomeId ?? null} />}
        isSidebarOpen={isSidebarOpen}
        topbarContent={<div />}
        sidebarNavigation={<SidebarNavigation genomeId={genomeId ?? null} />}
        onSidebarToggle={toggleSidebar}
        viewportWidth={1800}
      />
    </div>
  );
};

const MainContent = ({ genomeId }: { genomeId: string | null }) => {
  if (!genomeId) {
    // this will be an interstitial in the future
    return null;
  }

  return (
    <div className={styles.mainContentContainer}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--color-white)',
          zIndex: 1
        }}
      >
        <ActivityViewerFocusFeatureInfo />
        <RegionOverview />
        {/* The spacer divs below are temporary */}
        <div style={{ margin: '0.6rem 0' }} />
        <MainContentBottomViewControls genomeId={genomeId} />
      </div>
      <div style={{ margin: '0.6rem 0' }} />
      <MainContentBottom genomeId={genomeId} />
      <div style={{ margin: '4rem 0' }} />
    </div>
  );
};

const MainContentBottom = ({ genomeId }: { genomeId: string }) => {
  const activeView = useAppSelector((state) =>
    getMainContentBottomView(state, genomeId)
  );
  const isEpigenomeSelectorOpen = useAppSelector((state) =>
    getIsEpigenomeSelectorOpen(state, genomeId)
  );

  return (
    <>
      {activeView === 'epigenomes-list' && (
        <SelectedEpigenomes genomeId={genomeId} />
      )}
      {activeView === 'dataviz' && <RegionActivitySection />}
      {isEpigenomeSelectorOpen && (
        <EpigenomeSelectionModal genomeId={genomeId} />
      )}
    </>
  );
};

const MemoizedActivityViewer = memo(ActivityViewer);

const WrappedActivityViewer = () => (
  <ActivityViewerEpigenomesContextProvider>
    <MemoizedActivityViewer />
  </ActivityViewerEpigenomesContextProvider>
);

export default WrappedActivityViewer;
