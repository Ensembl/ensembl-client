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

import { useAppSelector, useAppDispatch } from 'src/store';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';

import {
  openSidebar,
  setSelectedTab,
  sidebarTabNames,
  // closeSidebarModal,
  // setSidebarTabName,
  type SidebarTabName
} from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSlice';

import {
  getIsSidebarOpen,
  getActiveSidebarTab
} from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSelectors';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

// import styles from './GeneViewSidebarTabs.module.css';

const tabsData: Tab[] = sidebarTabNames.map((name) => ({ title: name }));

const TranscriptViewSidebarTabs = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const isSidebarOpen = useAppSelector((state) =>
    getIsSidebarOpen(state, activeGenomeId ?? '', transcriptId ?? '')
  );
  const selectedTabName = useAppSelector((state) =>
    getActiveSidebarTab(state, activeGenomeId ?? '', transcriptId ?? '')
  );
  // const isSidebarModalViewOpen = Boolean(
  //   useAppSelector(getEntityViewerSidebarModalView)
  // );
  const dispatch = useAppDispatch();

  const handleTabChange = (name: string) => {
    if (!activeGenomeId || !transcriptId) {
      // this will not happen
      return;
    }
    if (!isSidebarOpen) {
      dispatch(
        openSidebar({
          genomeId: activeGenomeId,
          transcriptId
        })
      );
    }
    // if (isSidebarModalViewOpen) {
    //   dispatch(closeSidebarModal());
    // }
    dispatch(
      setSelectedTab({
        genomeId: activeGenomeId,
        transcriptId,
        selectedTabName: name as SidebarTabName
      })
    );
  };

  const tabClassNames = {
    // default: styles.defaultTab,
    // selected: styles.selectedTab,
    // disabled: styles.disabledTab,
    // tabsContainer: styles.tabsContainer
  };

  // const isSidebarActive = isSidebarOpen && !isSidebarModalViewOpen;
  const isSidebarActive = isSidebarOpen;

  return (
    <Tabs
      tabs={tabsData}
      selectedTab={isSidebarActive ? selectedTabName : null}
      onTabChange={handleTabChange}
      classNames={tabClassNames}
    />
  );
};

export default TranscriptViewSidebarTabs;
