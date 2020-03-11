import React from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';
import { RootState } from 'src/store';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { getEntityViewerActiveGeneRelationships } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneSelectors';
import { setActiveGeneRelationshipsTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneActions';

import styles from './GeneRelationships.scss';

const tabsData: Tab[] = [
  { title: 'Orthologues' },
  { title: 'Gene families' },
  { title: 'Gene panels' }
];

const tabClassNames = {
  selected: styles.selectedTab,
  default: styles.defaultTab
};

type Props = {
  isSidebarOpen: boolean;
  selectedTab: string;
  setActiveGeneRelationshipsTab: (tab: string) => void;
};

const GeneRelationships = (props: Props) => {
  const TabWrapper = () => {
    const onTabChange = (tab: string) => {
      props.setActiveGeneRelationshipsTab(tab);
    };

    return (
      <Tabs
        tabs={tabsData}
        selectedTab={props.selectedTab}
        classNames={tabClassNames}
        onTabChange={onTabChange}
      />
    );
  };

  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: props.isSidebarOpen
          ? styles.shrinkedPanel
          : styles.fullWidthPanel
      }}
    >
      <div>Panel content is coming...</div>
    </Panel>
  );
};

const mapStateToProps = (state: RootState) => ({
  isSidebarOpen: isEntityViewerSidebarOpen(state),
  selectedTab: getEntityViewerActiveGeneRelationships(state).selectedTab
});

const mapDispatchToProps = {
  setActiveGeneRelationshipsTab
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneRelationships);
