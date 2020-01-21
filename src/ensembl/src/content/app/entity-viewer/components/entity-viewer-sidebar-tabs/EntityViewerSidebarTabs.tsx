import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { setSidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import { getEntityViewerSidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import styles from './EntityViewerSidebarTabs.scss';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';
import { RootState } from 'src/store';

type Props = {
  activeTabName: SidebarTabName;
  setSidebarTabName: (name: SidebarTabName) => void;
};

const EntityViewerSidebarTabs = (props: Props) => {
  const handleTabChange = (name: SidebarTabName) => {
    props.setSidebarTabName(name);
  };

  const getTabProps = (name: SidebarTabName) => {
    const isActiveTab = name === props.activeTabName;
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
  activeTabName: getEntityViewerSidebarTabName(state)
});

const mapDispatchToProps = {
  setSidebarTabName
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityViewerSidebarTabs);
