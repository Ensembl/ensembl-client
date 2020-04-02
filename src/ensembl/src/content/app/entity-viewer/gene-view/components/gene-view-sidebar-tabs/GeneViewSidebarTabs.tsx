import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

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

import styles from './GeneViewSidebarTabs.scss';

type Props = {
  selectedTabName: SidebarTabName | null;
  isSidebarOpen: boolean;
  setSidebarTabName: (name: SidebarTabName) => void;
  openSidebar: () => void;
};

const GeneViewSidebarTabs = (props: Props) => {
  if (!props.selectedTabName) {
    return null;
  }

  const handleTabChange = (name: SidebarTabName) => {
    if (!props.isSidebarOpen) {
      props.openSidebar();
    }
    props.setSidebarTabName(name);
  };

  const getTabProps = (name: SidebarTabName) => {
    const isActiveTab = props.isSidebarOpen && name === props.selectedTabName;
    const classes = classNames(styles.tab, {
      [styles.tabUnselected]: !isActiveTab
    });

    const onClick = isActiveTab
      ? null
      : { onClick: () => handleTabChange(name) };

    return {
      className: classes,
      ...onClick
    };
  };

  return (
    <div className={styles.tabs}>
      <span {...getTabProps(SidebarTabName.OVERVIEW)}>Overview</span>
      <span {...getTabProps(SidebarTabName.PUBLICATIONS)}>Publications</span>
    </div>
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
