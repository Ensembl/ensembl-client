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

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  openSidebar,
  closeSidebarModal,
  setSidebarTabName
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarTabName,
  getEntityViewerSidebarModalView
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './GeneViewSidebarTabs.scss';

const tabsData: Tab[] = [];

Object.values(SidebarTabName).forEach((value) =>
  tabsData.push({
    title: value
  })
);

const DEFAULT_TAB = tabsData[0].title;

const GeneViewSidebarTabs = () => {
  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);
  const selectedTabName = useSelector(getEntityViewerSidebarTabName);
  const isSidebarModalViewOpen = Boolean(
    useSelector(getEntityViewerSidebarModalView)
  );

  const dispatch = useDispatch();
  const { trackXrefsTabSelection } = useEntityViewerAnalytics();

  if (!selectedTabName) {
    return null;
  }

  const handleTabChange = (name: string) => {
    if (!isSidebarOpen) {
      dispatch(openSidebar());
    }
    if (isSidebarModalViewOpen) {
      dispatch(closeSidebarModal());
    }
    if (name === SidebarTabName.EXTERNAL_REFERENCES) {
      trackXrefsTabSelection(name);
    }
    dispatch(setSidebarTabName(name as SidebarTabName));
  };

  const tabClassNames = {
    default: styles.defaultTab,
    selected: styles.selectedTab,
    disabled: styles.disabledTab,
    tabsContainer: styles.tabsContainer
  };

  const isSidebarActive = isSidebarOpen && !isSidebarModalViewOpen;

  return (
    <Tabs
      tabs={tabsData}
      selectedTab={isSidebarActive ? selectedTabName || DEFAULT_TAB : null}
      onTabChange={handleTabChange}
      classNames={tabClassNames}
    />
  );
};

export default GeneViewSidebarTabs;
