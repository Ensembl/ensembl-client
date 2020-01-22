import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  toggleSidebar,
  setSidebarTabName
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarTabName
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import styles from './EntityViewerSidebarTabs.scss';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { RootState } from 'src/store';

type Props = {
  activeTabName: SidebarTabName | null;
  isSidebarOpen: boolean;
  setSidebarTabName: (name: SidebarTabName) => void;
  toggleSidebar: (isOpen?: boolean) => void;
};

const EntityViewerSidebarTabs = (props: Props) => {
  if (!props.activeTabName) {
    return null;
  }

  const handleTabChange = (name: SidebarTabName) => {
    if (!props.isSidebarOpen) {
      props.toggleSidebar(true);
    }
    props.setSidebarTabName(name);
  };

  const getTabProps = (name: SidebarTabName) => {
    const isActiveTab = props.isSidebarOpen && name === props.activeTabName;
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
  activeTabName: getEntityViewerSidebarTabName(state),
  isSidebarOpen: isEntityViewerSidebarOpen(state)
});

const mapDispatchToProps = {
  setSidebarTabName,
  toggleSidebar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityViewerSidebarTabs);
