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
import { connect } from 'react-redux';

import {
  openSidebar,
  setSidebarTabName
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarTabName
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { RootState } from 'src/store';

import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './GeneViewSidebarTabs.scss';

type Props = {
  selectedTabName: SidebarTabName | null;
  isSidebarOpen: boolean;
  setSidebarTabName: (name: SidebarTabName) => void;
  openSidebar: () => void;
};

const tabsData: Tab[] = [];
Object.values(SidebarTabName).forEach((value) =>
  tabsData.push({
    title: value
  })
);

const DEFAULT_TAB = tabsData[0].title;

const GeneViewSidebarTabs = (props: Props) => {
  if (!props.selectedTabName) {
    return null;
  }

  const handleTabChange = (name: string) => {
    if (!props.isSidebarOpen) {
      props.openSidebar();
    }
    props.setSidebarTabName(name as SidebarTabName);
  };

  const tabClassNames = {
    default: styles.defaultTab,
    selected: styles.selectedTab,
    disabled: styles.disabledTab,
    tabsContainer: styles.tabsContainer
  };

  return (
    <Tabs
      tabs={tabsData}
      selectedTab={
        !props.isSidebarOpen ? null : props.selectedTabName || DEFAULT_TAB
      }
      onTabChange={handleTabChange}
      classNames={tabClassNames}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedTabName: getEntityViewerSidebarTabName(state),
  isSidebarOpen: isEntityViewerSidebarOpen(state)
});

const mapDispatchToProps = {
  setSidebarTabName,
  openSidebar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneViewSidebarTabs);
