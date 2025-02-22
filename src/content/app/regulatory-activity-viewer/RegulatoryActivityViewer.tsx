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

import noop from 'lodash/noop';

import { useAppSelector } from 'src/store';

import { getMainContentBottomView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import useActivityViewerIds from './hooks/useActivityViewerIds';
import usePreselectedEpigenomes from './hooks/usePreselectedEpigenomes';
import useActivityViewerRouting from './hooks/useActivityViewerRouting';

import ActivityViewerEpigenomesContextProvider from 'src/content/app/regulatory-activity-viewer/contexts/ActivityViewerEpigenomesContextProvider';
import { StandardAppLayout } from 'src/shared/components/layout';
import ActivityViewerAppBar from './components/activity-viewer-app-bar/ActivityViewerAppBar';
import ActivityViewerInterstitial from './components/activity-viewer-interstitial/ActivityViewerInterstitial';
import RegionOverview from './components/region-overview/RegionOverview';
import RegionActivitySection from './components/region-activity-section/RegionActivitySection';
import ActivityViewerSidebar from './components/activity-viewer-sidebar/ActivityViewerSidebar';
import SidebarNavigation from './components/activity-viewer-sidebar/sidebar-navigation/SidebarNavigation';
import MainContentBottomViewControls from './components/main-content-bottom-view-controls/MainContentBottomViewControls';
import EpigenomeSelectionModal from './components/epigenome-selection-modal/EpigenomeSelectionModal';
import SelectedEpigenomes from './components/selected-epigenomes/SelectedEpigenomes';

import styles from './RegulatoryActivityViewer.module.css';

const ActivityViewer = () => {
  const { activeGenomeId, genomeIdInUrl, location } = useActivityViewerIds();
  useActivityViewerRouting();
  usePreselectedEpigenomes();

  if (!genomeIdInUrl) {
    // TODO: add a proper component for this
    return (
      <div className={styles.container}>
        <ActivityViewerAppBar />
        <div>Please select species.</div>
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
        mainContent={<MainContent genomeId={activeGenomeId} />}
        sidebarContent={<ActivityViewerSidebar genomeId={activeGenomeId} />}
        isSidebarOpen={true}
        topbarContent={<div />}
        sidebarNavigation={<SidebarNavigation genomeId={activeGenomeId} />}
        onSidebarToggle={noop}
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
    <div>
      Placeholder for focus feature information
      <RegionOverview />
    </div>
  );


  // return (
  //   <div>
  //     Placeholder for focus feature information
  //     <RegionOverview />
  //     {/* The spacer divs below are temporary */}
  //     <div style={{ margin: '0.6rem 0' }} />
  //     <MainContentBottomViewControls genomeId={genomeId} />
  //     <div style={{ margin: '0.6rem 0' }} />
  //     <MainContentBottom genomeId={genomeId} />
  //     <div style={{ margin: '4rem 0' }} />
  //   </div>
  // );
};

const MainContentBottom = ({ genomeId }: { genomeId: string }) => {
  const activeView = useAppSelector((state) =>
    getMainContentBottomView(state, genomeId)
  );

  return (
    <>
      {['epigenomes-list', 'epigenomes-selection'].includes(activeView) && (
        <SelectedEpigenomes genomeId={genomeId} />
      )}
      {activeView === 'epigenomes-selection' && (
        <EpigenomeSelectionModal genomeId={genomeId} />
      )}
      {activeView === 'dataviz' && <RegionActivitySection />}
    </>
  );
};

const WrappedActivityViewer = () => (
  <ActivityViewerEpigenomesContextProvider>
    <ActivityViewer />
  </ActivityViewerEpigenomesContextProvider>
);

export default WrappedActivityViewer;
