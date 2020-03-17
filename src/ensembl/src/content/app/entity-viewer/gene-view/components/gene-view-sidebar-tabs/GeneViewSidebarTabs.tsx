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
  activeTabName: SidebarTabName | null;
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
  if (!props.activeTabName) {
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
      selectedTab={props.activeTabName || DEFAULT_TAB}
      onTabChange={handleTabChange}
      classNames={tabClassNames}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  activeTabName: getEntityViewerSidebarTabName(state),
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
