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

import { getActiveGenomeId } from 'src/content/app/regulatory-activity-viewer/state/general/generalSelectors';
// import { getMainContentBottomView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import usePreselectedEpigenomes from './hooks/usePreselectedEpigenomes';

import { StandardAppLayout } from 'src/shared/components/layout';
import ActivityViewerAppBar from './components/activity-viewer-app-bar/ActivityViewerAppBar';
import RegionOverview from './components/region-overview/RegionOverview';
import RegionActivitySection from './components/region-activity-section/RegionActivitySection';
import ActivityViewerSidebar from './components/activity-viewer-sidebar/ActivityViewerSidebar';
import SidebarNavigation from './components/activity-viewer-sidebar/sidebar-navigation/SidebarNavigation';
import MainContentBottomViewControls from './components/main-content-bottom-view-controls/MainContentBottomViewControls';
// import EpigenomeSelectionModal from './components/epigenome-selection-modal/EpigenomeSelectionModal';
// import SelectedEpigenomes from './components/selected-epigenomes/SelectedEpigenomes';

import styles from './RegulatoryActivityViewer.module.css';

const ActivityViewer = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  usePreselectedEpigenomes();

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
      <RegionOverview activeGenomeId={genomeId} />
      {/* The spacer divs below are temporary */}
      <div style={{ margin: '0.6rem 0' }} />
      <MainContentBottomViewControls genomeId={genomeId} />
      <div style={{ margin: '0.6rem 0' }} />
      <MainContentBottom genomeId={genomeId} />
      <div style={{ margin: '4rem 0' }} />
    </div>
  );
};

const MainContentBottom = ({ genomeId }: { genomeId: string }) => {
  // const activeView = useAppSelector((state) =>
  //   getMainContentBottomView(state, genomeId)
  // );

  return (
    <>
      <RegionActivitySection activeGenomeId={genomeId} />
    </>
  );

  // return (
  //   <>
  //     {['epigenomes-list', 'epigenomes-selection'].includes(activeView) && (
  //       <SelectedEpigenomes genomeId={genomeId} />
  //     )}
  //     {activeView === 'epigenomes-selection' && (
  //       <EpigenomeSelectionModal genomeId={genomeId} />
  //     )}
  //     {activeView === 'dataviz' && (
  //       <RegionActivitySection activeGenomeId={genomeId} />
  //     )}
  //   </>
  // );
};

export default ActivityViewer;
