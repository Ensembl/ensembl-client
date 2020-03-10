import React, { useState } from 'react';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';
import Panel from 'src/shared/components/panel/Panel';

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

const TabWrapper = () => {
  const [selectedTab, setselectedTab] = useState('Orthologues');

  const onTabChange = (tab: string) => {
    setselectedTab(tab);
  };

  return (
    <Tabs
      tabs={tabsData}
      selectedTab={selectedTab}
      classNames={tabClassNames}
      onTabChange={onTabChange}
    />
  );
};

const GeneRelationships = () => {
  return (
    <Panel
      header={<TabWrapper />}
      classNames={{
        panel: styles.fullWidthPanel
      }}
    >
      <div>Panel Content</div>
    </Panel>
  );
};

export default GeneRelationships;
